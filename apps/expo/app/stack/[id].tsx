import { StackScreen } from 'app/features/stack/stack-screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Stack',
        }}
      />
      <StackScreen />
    </>
  )
}
