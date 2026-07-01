import { ScrollView, Text, View, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useData } from '@/lib/context/data-context';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function GoalsScreen() {
  const colors = useColors();
  const { dataService } = useData();
  const router = useRouter();
  const [goalType, setGoalType] = useState<'short-term' | 'long-term'>('short-term');
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [progress, setProgress] = useState('0');

  const goals = dataService.getAllGoals();
  const filteredGoals = goals.filter(g => g.type === goalType);

  const handleAddGoal = async () => {
    if (!title || !deadline) {
      alert('Please fill in title and deadline');
      return;
    }

    try {
      await dataService.addGoal({
        title,
        description: description || undefined,
        type: goalType,
        deadline,
        progress: parseInt(progress) || 0,
        status: 'on-track',
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTitle('');
      setDescription('');
      setDeadline('');
      setProgress('0');
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add goal:', error);
      alert('Failed to add goal');
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      await dataService.deleteGoal(id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  const handleUpdateProgress = async (id: string, newProgress: number) => {
    try {
      await dataService.updateGoal(id, {
        progress: Math.min(100, Math.max(0, newProgress)),
        status: newProgress >= 100 ? 'completed' : 'on-track',
      });
    } catch (error) {
      console.error('Failed to update goal:', error);
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 gap-4">
          {/* Header */}
          <View className="flex-row justify-between items-center">
            <View className="gap-1">
              <Text className="text-3xl font-bold text-foreground">Goals</Text>
              <Text className="text-sm text-muted">Track your progress</Text>
            </View>
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="close" size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          {/* Goal Type Tabs */}
          <View className="flex-row gap-3">
            {(['short-term', 'long-term'] as const).map(type => (
              <TouchableOpacity
                key={type}
                onPress={() => setGoalType(type)}
                className={`flex-1 py-3 px-4 rounded-lg border ${
                  goalType === type
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                }`}
              >
                <Text
                  className={`text-center font-semibold capitalize ${
                    goalType === type ? 'text-white' : 'text-foreground'
                  }`}
                >
                  {type.replace('-', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Add Goal Form */}
          {showForm && (
            <View className="bg-surface rounded-2xl p-4 gap-3 border border-border">
              <Text className="text-lg font-semibold text-foreground">Add New Goal</Text>

              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Title</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                  placeholder="Goal title"
                  placeholderTextColor={colors.muted}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Description</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-4 py-3 text-foreground min-h-[80px]"
                  placeholder="Goal description"
                  placeholderTextColor={colors.muted}
                  multiline
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Deadline</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.muted}
                  value={deadline}
                  onChangeText={setDeadline}
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Initial Progress (%)</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                  placeholder="0"
                  placeholderTextColor={colors.muted}
                  keyboardType="number-pad"
                  value={progress}
                  onChangeText={setProgress}
                />
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setShowForm(false)}
                  className="flex-1 bg-surface border border-border rounded-lg py-3"
                >
                  <Text className="text-center font-semibold text-foreground">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddGoal}
                  className="flex-1 bg-primary rounded-lg py-3"
                >
                  <Text className="text-center font-semibold text-white">Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Goals List */}
          <View className="gap-3">
            {filteredGoals.length > 0 ? (
              filteredGoals.map(goal => (
                <View key={goal.id} className="bg-surface rounded-2xl p-4 border border-border gap-3">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1 gap-1">
                      <Text className="text-base font-semibold text-foreground">{goal.title}</Text>
                      {goal.description && (
                        <Text className="text-xs text-muted">{goal.description}</Text>
                      )}
                      <Text className="text-xs text-muted">Deadline: {goal.deadline}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteGoal(goal.id)}>
                      <Text className="text-error font-semibold text-xs">Delete</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Progress Bar */}
                  <View className="gap-2">
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-muted">Progress</Text>
                      <Text className="text-xs font-semibold text-foreground">{goal.progress}%</Text>
                    </View>
                    <View className="h-2 bg-background rounded-full overflow-hidden">
                      <View
                        className="h-full bg-primary"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </View>
                  </View>

                  {/* Progress Controls */}
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => handleUpdateProgress(goal.id, goal.progress - 10)}
                      className="flex-1 bg-background rounded-lg py-2 items-center"
                    >
                      <Text className="text-sm font-semibold text-foreground">-10%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleUpdateProgress(goal.id, goal.progress + 10)}
                      className="flex-1 bg-primary rounded-lg py-2 items-center"
                    >
                      <Text className="text-sm font-semibold text-white">+10%</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View className="items-center py-8">
                <Text className="text-muted">No {goalType.replace('-', ' ')} goals yet</Text>
              </View>
            )}
          </View>

          {/* Add Button */}
          {!showForm && (
            <TouchableOpacity
              onPress={() => setShowForm(true)}
              className="bg-primary rounded-lg py-4 items-center mt-4"
            >
              <Text className="text-white font-semibold">+ Add Goal</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
