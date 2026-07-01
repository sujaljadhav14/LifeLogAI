import { ScrollView, Text, View, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  const [notifications, setNotifications] = useState(true);
  const [haptics, setHaptics] = useState(true);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Note: Actual dark mode toggle would require updating the theme context
  };

  const handleToggleNotifications = () => {
    setNotifications(!notifications);
    if (!notifications) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleToggleHaptics = () => {
    setHaptics(!haptics);
    if (!haptics) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 gap-4">
          {/* Header */}
          <View className="flex-row justify-between items-center">
            <View className="gap-1">
              <Text className="text-3xl font-bold text-foreground">Settings</Text>
              <Text className="text-sm text-muted">Customize your experience</Text>
            </View>
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="close" size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          {/* Display Settings */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Display</Text>

            <View className="bg-surface rounded-2xl p-4 border border-border flex-row justify-between items-center">
              <View className="gap-1">
                <Text className="text-base font-semibold text-foreground">Dark Mode</Text>
                <Text className="text-xs text-muted">Use dark theme</Text>
              </View>
              <Switch value={darkMode} onValueChange={handleToggleDarkMode} />
            </View>
          </View>

          {/* Notification Settings */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Notifications</Text>

            <View className="bg-surface rounded-2xl p-4 border border-border flex-row justify-between items-center">
              <View className="gap-1">
                <Text className="text-base font-semibold text-foreground">Enable Notifications</Text>
                <Text className="text-xs text-muted">Receive daily reminders</Text>
              </View>
              <Switch value={notifications} onValueChange={handleToggleNotifications} />
            </View>
          </View>

          {/* Feedback Settings */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Feedback</Text>

            <View className="bg-surface rounded-2xl p-4 border border-border flex-row justify-between items-center">
              <View className="gap-1">
                <Text className="text-base font-semibold text-foreground">Haptic Feedback</Text>
                <Text className="text-xs text-muted">Vibration on interactions</Text>
              </View>
              <Switch value={haptics} onValueChange={handleToggleHaptics} />
            </View>
          </View>

          {/* About Section */}
          <View className="gap-3 mt-4">
            <Text className="text-lg font-semibold text-foreground">About</Text>

            <View className="bg-surface rounded-2xl p-4 border border-border gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">App Version</Text>
                <Text className="text-sm font-semibold text-foreground">1.0.0</Text>
              </View>
              <View className="flex-row justify-between pt-2 border-t border-border">
                <Text className="text-sm text-muted">Build</Text>
                <Text className="text-sm font-semibold text-foreground">MVP</Text>
              </View>
            </View>
          </View>

          {/* Data Management */}
          <View className="gap-3 mt-4">
            <Text className="text-lg font-semibold text-foreground">Data</Text>

            <TouchableOpacity className="bg-surface rounded-2xl p-4 border border-border flex-row justify-between items-center">
              <View className="gap-1">
                <Text className="text-base font-semibold text-foreground">Export Data</Text>
                <Text className="text-xs text-muted">Download your data</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.muted} />
            </TouchableOpacity>

            <TouchableOpacity className="bg-error/10 rounded-2xl p-4 border border-error flex-row justify-between items-center">
              <View className="gap-1">
                <Text className="text-base font-semibold text-error">Clear All Data</Text>
                <Text className="text-xs text-error/70">Delete all app data</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
