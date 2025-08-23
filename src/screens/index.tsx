import { Redirect } from 'expo-router';

export default function Index() {
  // Перенаправляем с "/" на "/home-page"
  return <Redirect href="/home-page" />;
}
