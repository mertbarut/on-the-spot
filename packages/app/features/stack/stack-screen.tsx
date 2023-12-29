import { Button, Paragraph, YStack, XStack, Progress, SizeTokens, Square, Text } from '@my/ui'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createParam } from 'solito'
import { useLink } from 'solito/link'
import Swiper from 'react-native-deck-swiper'
import { Direction, StackableCard } from '../card/stackableCard'
import Animated, { SlideOutDown, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'

const { useParam } = createParam<{ id: string }>()

export function StackScreen() {
  const swiperRef = useRef<Swiper<string>>(null)
  const [id] = useParam('id')
  const link = useLink({
    href: '/',
  })
  const [isGameOn, setGameOn] = useState(false)
  const [isStackComplete, setStackComplete] = useState(false)
  const [isBounced, setBounced] = useState(false)
  const [size, setSize] = useState(2)
  const [progress, setProgress] = useState(0)
  const sizeProp = useMemo(() => {
    return `$${size}` as SizeTokens
  }, [size])
  const [hearts, setHearts] = useState(3)
  const baseBpm = 80
  const [bpm, setBpm] = useState(baseBpm)
  const bounceTimer = useMemo(() => {
    return 60_000 / bpm / 2
  }, [bpm])

  const cards = useMemo(() => {
    return [
      { label: 'Seite', definition: '', correctDirection: 'right' },
      { label: 'Zimmer', definition: '', correctDirection: 'bottom' },
      { label: 'Kühlschrank', definition: '', correctDirection: 'left' },
      { label: 'Handschuh', definition: '', correctDirection: 'left' },
      { label: 'Ei', definition: '', correctDirection: 'bottom' },
      { label: 'Weh', definition: '', correctDirection: 'bottom' },
      { label: 'Kino', definition: '', correctDirection: 'bottom' },
      { label: 'Ausgang', definition: '', correctDirection: 'left' },
      { label: 'Brücke', definition: '', correctDirection: 'right' },
      { label: 'Gefühl', definition: '', correctDirection: 'bottom' },
    ]
  }, [])
  const options = useMemo(() => {
    return {
      left: {
        label: 'DER',
        onSelect: () => {
          swiperRef.current?.swipeLeft()
        },
      },
      right: {
        label: 'DIE',
        onSelect: () => {
          swiperRef.current?.swipeRight()
        },
      },
      bottom: {
        label: 'DAS',
        onSelect: () => {
          swiperRef.current?.swipeBottom()
        },
      },
    }
  }, [swiperRef.current])

  const prompt = 'Der, die, oder das?'
  const isPromptDisplayed = useMemo(
    () => hearts !== 0 && !isStackComplete,
    [hearts, isStackComplete]
  )
  const isGameStarted = useMemo(() => hearts === 0 || !isGameOn, [hearts, isGameOn])
  const isGameOver = useMemo(() => hearts === 0, [hearts])
  const cardLabels = useMemo(() => cards.map((card) => card.label), [cards])
  const limitOfBpmIncrease = 5
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  useEffect(() => {
    if (!isGameOn) {
      return
    }
    if (progress > 100) {
      if (hearts > 1) {
        setHearts(hearts - 1)
        swiperRef.current?.swipeTop()
        setProgress(0)
        return
      }
      if (hearts === 1) {
        setHearts(hearts - 1)
        swiperRef.current?.swipeTop()
        setGameOn(false)
        setProgress(100)
        return
      }
      return () => {
        setProgress(100)
        setGameOn(false)
        clearTimeout(timer)
      }
    }
    const timer = setTimeout(() => {
      setProgress(progress + 10)
      setBounced(!isBounced)
      if (isBounced) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }
    }, bounceTimer)
    return () => {
      clearTimeout(timer)
    }
  }, [progress, isGameOn])

  const onSelect = useCallback(
    (cardIndex: number, direction: Direction) => {
      if (hearts === 0) {
        return
      }
      if (cards[cardIndex]?.correctDirection === direction) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        setProgress(0)
        if (cardIndex < limitOfBpmIncrease) {
          setBpm(baseBpm + cardIndex * 15)
        }
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        if (hearts === 1) {
          setProgress(100)
          setHearts(0)
          setGameOn(false)
        } else {
          setProgress(0)
          setHearts(hearts - 1)
        }
      }
    },
    [cards, hearts]
  )

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isBounced ? 1.03 : 1) }],
    }
  }, [isBounced])

  const animatedStylesFullHeart = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(!isBounced ? 1.03 : 1) }],
    }
  }, [isBounced])

  const animatedStylesTwoHearts = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(!isBounced ? 1.1 : 1) }],
    }
  }, [isBounced])

  const animatedStylesLastHeart = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(!isBounced ? 1.2 : 1) }],
    }
  }, [isBounced])

  const renderCard: (cardData: string, cardIndex: number) => JSX.Element = useCallback(
    (cardData, cardIndex) => {
      return (
        <Animated.View style={animatedStyles}>
          <StackableCard
            title={cardData}
            definition={cards[cardIndex]?.definition}
            alignSelf="center"
            options={options}
          />
        </Animated.View>
      )
    },
    [cards, options]
  )

  const onSwipeLeft: (cardIndex: number) => void = useCallback(
    (cardIndex) => {
      onSelect(cardIndex, 'left')
    },
    [onSelect]
  )

  const onSwipeRight: (cardIndex: number) => void = useCallback(
    (cardIndex) => {
      onSelect(cardIndex, 'right')
    },
    [onSelect]
  )

  const onSwipeBottom: (cardIndex: number) => void = useCallback(
    (cardIndex) => {
      onSelect(cardIndex, 'bottom')
    },
    [onSelect]
  )

  const onSwipedAll = useCallback(() => {
    setStackComplete(true)
    setGameOn(false)
    setProgress(100)
  }, [])

  const onSwiped = useCallback(() => {
    setCurrentCardIndex(currentCardIndex + 1)
  }, [currentCardIndex])

  const heartAnimationStyle = useMemo(
    () =>
      hearts === 1
        ? animatedStylesLastHeart
        : hearts === 2
        ? animatedStylesTwoHearts
        : animatedStylesFullHeart,
    [hearts]
  )

  const onPressMainButton = useCallback(() => {
    setGameOn(true)
    setHearts(3)
    setProgress(0)
    setBpm(baseBpm)
    setStackComplete(false)
    setCurrentCardIndex(0)
  }, [])

  return (
    <YStack f={1}>
      <Progress
        backgroundColor="$backgroundFocus"
        size={sizeProp}
        value={progress}
        borderRadius={0}
      >
        <Progress.Indicator animation="quick" />
      </Progress>
      <YStack f={1 / 8} alignItems="center" justifyContent="center">
        <Paragraph ta="center">{isPromptDisplayed && prompt}</Paragraph>
      </YStack>
      <YStack f={5 / 8}>
        <Paragraph ta="center" alignSelf="center" size="$8">
          {isGameOver ? '☠️' : isStackComplete ? '🚀' : `${currentCardIndex} / ${cards.length}`}
        </Paragraph>
        {isGameOn && (
          <Swiper
            ref={swiperRef}
            disableTopSwipe
            animateCardOpacity
            animateOverlayLabelsOpacity
            cards={cardLabels}
            renderCard={renderCard}
            onSwipedLeft={onSwipeLeft}
            onSwipedRight={onSwipeRight}
            onSwipedBottom={onSwipeBottom}
            onSwipedAll={onSwipedAll}
            onSwiped={onSwiped}
            cardIndex={0}
            backgroundColor="transparent"
            stackSize={3}
          />
        )}
      </YStack>
      <XStack f={1 / 8} jc="space-around">
        {isGameOn ? (
          [...Array(hearts).keys()].map((e, i) => (
            <Animated.View key={i} style={heartAnimationStyle} exiting={SlideOutDown}>
              <Square backgroundColor="transparent">
                <Text fontSize={hearts === 1 ? '$12' : hearts === 2 ? '$11' : '$10'}>🩷</Text>
              </Square>
            </Animated.View>
          ))
        ) : (
          <Button onPress={onPressMainButton} backgroundColor="$blue8">
            {isGameOver ? 'Try again' : isStackComplete ? 'Next Level' : 'Start'}
          </Button>
        )}
      </XStack>
    </YStack>
  )
}
