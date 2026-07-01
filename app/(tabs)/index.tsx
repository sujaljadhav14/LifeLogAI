import { ScrollView, Text, View, TouchableOpacity, RefreshControl } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useData } from '@/lib/context/data-context';
import { useColors } from '@/hooks/use-colors';

export default function DashboardScreen() {
  const colors = useColors();
  const { dataService } = useData();
  const [refreshing, setRefreshing] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const checkIns = dataService.getCheckInsByDate(today);
  const activities = dataService.getActivitiesByDate(today);
  const habits = dataService.getAllHabits();
  const goals = dataService.getAllGoals();

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 500));
    setRefreshing(false);
  };

  const habitsCompletedToday = habits.filter(h => dataService.isHabitCompletedOnDate(h.id, today)).length;

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1 p-6 gap-4">
          {/* Header */}
          <View className="gap-1">
            <Text className="text-4xl font-bold text-foreground">Today</Text>
            <Text className="text-sm text-muted">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
          </View>

          {/* Quick Stats Card */}
          <View className="bg-surface rounded-2xl p-4 gap-3 border border-border">
            <Text className="text-lg font-semibold text-foreground">Today's Overview</Text>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Habits Completed</Text>
                <Text className="text-sm font-semibold text-foreground">{habitsCompletedToday} / {habits.length}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Activities Logged</Text>
                <Text className="text-sm font-semibold text-foreground">{activities.length}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Active Goals</Text>
                <Text className="text-sm font-semibold text-foreground">{goals.filter(g => g.status !== 'completed').length}</Text>
              </View>
            </View>
          </View>

          {/* Recent Activities */}
          {activities.length > 0 && (
            <View className="gap-2">
              <Text className="text-lg font-semibold text-foreground">Recent Activities</Text>
              <View className="bg-surface rounded-2xl p-4 gap-2 border border-border">
                {activities.slice(0, 3).map(activity => (
                  <View key={activity.id} className="flex-row justify-between py-2 border-b border-border last:border-b-0">
                    <View className="gap-1">
                      <Text className="text-sm font-medium text-foreground">{activity.category}</Text>
                      <Text className="text-xs text-muted">{activity.time}</Text>
                    </View>
                    {activity.notes && <Text className="text-xs text-muted">{activity.notes.substring(0, 20)}...</Text>}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Quick Actions */}
          <View className="flex-row gap-3 mt-2">
            <TouchableOpacity className="flex-1 bg-primary rounded-lg py-3 items-center">
              <Text className="text-white font-semibold">+ Activity</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-surface rounded-lg py-3 items-center border border-border">
              <Text className="text-foreground font-semibold">+ Check-in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
