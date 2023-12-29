import { Button, Card, CardProps, H2, Image, Text, Paragraph, XStack, YStack } from 'tamagui'
import {
  ArrowBigLeft,
  ArrowDown,
  ArrowDownWideNarrow,
  ArrowLeft,
  ArrowRight,
} from '@tamagui/lucide-icons'

type StackableCardProps = CardProps & {
  title: string
  definition?: string
  options: StackableCardOptions
}

export type Direction = 'left' | 'bottom' | 'right'

export type StackableCardOption = {
  label: string
  onSelect: (direction: Direction) => void
}

export type StackableCardOptions = {
  left: StackableCardOption
  right: StackableCardOption
  bottom: StackableCardOption
}

export function StackableCard(props: StackableCardProps) {
  const title = props.title
  const definition = props.definition
  const options = props.options

  return (
    <Card elevate bordered w={320} h={320} {...props}>
      <Card.Header padded alignSelf="center" mt="$4">
        <H2 alignSelf="center">{title}</H2>
        {definition && (
          <Paragraph theme="alt2" alignSelf="center">
            {definition}
          </Paragraph>
        )}
      </Card.Header>
      <Card.Footer padded>
        <YStack f={1} space="$space.10">
          <XStack justifyContent="space-around" space="$space.8">
            <Button icon={ArrowLeft} onPress={() => options.left.onSelect('left')}>
              <Paragraph size="$4" fontWeight="800">
                {options.left.label}
              </Paragraph>
            </Button>
            <Button iconAfter={ArrowRight} onPress={() => options.right.onSelect('right')}>
              <Paragraph size="$4" fontWeight="800">
                {options.right.label}
              </Paragraph>
            </Button>
          </XStack>
          <XStack alignSelf="center">
            <Button iconAfter={ArrowDown} onPress={() => options.bottom.onSelect('bottom')}>
              <Paragraph size="$4" fontWeight="800">
                {options.bottom.label}
              </Paragraph>
            </Button>
          </XStack>
        </YStack>
      </Card.Footer>
    </Card>
  )
}
