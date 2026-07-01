import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'goals',
    title: 'Goals',
    description: 'Manage short and long-term goals',
    icon: 'flag',
    route: '/goals',
  },
  {
    id: 'nutrition',
    title: 'Nutrition Log',
    description: 'Track meals and nutrition',
    icon: 'restaurant',
    route: '/nutrition',
  },
  {
    id: 'workout',
    title: 'Workout Log',
    description: 'Record exercises and workouts',
    icon: 'fitness-center',
    route: '/workout',
  },
  {
    id: 'journal',
    title: 'Daily Journal',
    description: 'Write reflections and thoughts',
    icon: 'edit-note',
    route: '/journal',
  },
  {
    id: 'summary',
    title: 'AI Daily Summary',
    description: 'View AI-generated insights',
    icon: 'lightbulb',
    route: '/summary',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'App preferences and options',
    icon: 'settings',
    route: '/settings',
  },
];

export default function MoreScreen() {
  const colors = useColors();
  const router = useRouter();

  const handleNavigate = (route: string) => {
    router.push(route as any);
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 gap-4">
          {/* Header */}
          <View className="gap-1">
            <Text className="text-3xl font-bold text-foreground">More</Text>
            <Text className="text-sm text-muted">Access additional features</Text>
          </View>

          {/* Menu Items */}
          <View className="gap-3">
            {MENU_ITEMS.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleNavigate(item.route)}
                className="bg-surface rounded-2xl p-4 border border-border flex-row items-center gap-4 active:opacity-70"
              >
                <View className="w-12 h-12 rounded-lg bg-primary/10 items-center justify-center">
                  <MaterialIcons name={item.icon as any} size={24} color={colors.primary} />
                </View>
                <View className="flex-1 gap-1">
                  <Text className="text-base font-semibold text-foreground">{item.title}</Text>
                  <Text className="text-xs text-muted">{item.description}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={colors.muted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
