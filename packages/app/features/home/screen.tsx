import {
  Anchor,
  Button,
  H1,
  Paragraph,
  Separator,
  XStack,
  YStack,
} from '@my/ui'
import React from 'react'
import { useLink } from 'solito/link'
import { HomeSheet } from './sheet'

export function HomeScreen() {
  const linkProps = useLink({
    href: '/stack/1',
  })

  return (
    <YStack f={1} jc="center" ai="center" p="$4" space>
      <YStack space="$4" maw={600}>
        <H1 ta="center">10 x 10</H1>
        <Paragraph ta="center">This is the home screen.</Paragraph>
        <Separator />
        <Paragraph ta="center">
          Developed by{' '}
          <Anchor color="$color12" href="https://github.com/mertbarut" target="_blank">
            mertbarut@github
          </Anchor>
        </Paragraph>
      </YStack>

      <XStack>
        <Button {...linkProps}>Link to Cards 🃏</Button>
      </XStack>

      <HomeSheet />
    </YStack>
  )
}
