import { Button, Paragraph, YStack, Stack } from '@my/ui'
import { ChevronLeft, PersonStanding } from '@tamagui/lucide-icons'
import React from 'react'
import { createParam } from 'solito'
import { useLink } from 'solito/link'
import { Square } from 'tamagui'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { Dimensions } from 'react-native'

const { useParam } = createParam<{ id: string }>()

export function UserDetailScreen() {
  const [id] = useParam('id')
  const link = useLink({
    href: '/',
  })

  const isPressed = useSharedValue(false)
  const offset = useSharedValue({ x: 0, y: 0 })
  const start = useSharedValue({ x: 0, y: 0 })

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: withSpring(isPressed.value ? 1.2 : 1) },
      ],
    }
  })

  const blockSize = 32
  const margin = Dimensions.get('screen').width % blockSize
  const blocksPerRow = (Dimensions.get('screen').width - margin) / blockSize
  const moveThreshold = Dimensions.get('screen').width / blocksPerRow

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true
    })
    .onUpdate((e) => {
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      }
    })
    .onEnd(() => {
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      }
    })
    .onFinalize(() => {
      isPressed.value = false
    })

  return (
    <Stack f={1} jc="flex-end" space="$1" backgroundColor="$color.pink6Light" margin={margin / 2}>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            {
              backgroundColor: 'transparent',
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            },
            animatedStyles,
          ]}
        >
          <Square
            borderColor="$borderColor"
            backgroundColor="$color.orange8Light"
            size="$3" // 32
            borderRadius="$2"
          />
        </Animated.View>
      </GestureDetector>
    </Stack>
  )
}
