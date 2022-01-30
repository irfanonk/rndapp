import { StatusBar } from "expo-status-bar";
import AppNavigator from "./navigation/AppNavigator";
import { ThemeProvider } from "react-native-rapi-ui";
import { WalletProvider } from "./context/wallet";
WalletProvider;

export default function App() {
  return (
    <ThemeProvider>
      <WalletProvider>
        <AppNavigator />
        <StatusBar />
      </WalletProvider>
    </ThemeProvider>
  );
}
