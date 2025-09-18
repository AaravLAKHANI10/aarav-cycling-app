import React, { useState, useEffect } from 'react';
import { 
  SignedIn, 
  SignedOut, 
  SignInButton,
  SignUpButton,
  UserButton,
  useUser
} from '@clerk/clerk-react';
import { 
  Target, 
  Plus,
  X,
  Calendar,
  TrendingUp,
  Clock,
  ChevronRight,
  Trash2,
  CheckCircle,
  LogIn,
  UserPlus,
  Shield
} from 'lucide-react';

const App = () => {
  const { user } = useUser();
  const [goals, setGoals] = useState([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showGoalDetails, setShowGoalDetails] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal',
    targetValue: '',
    currentValue: 0,
    unit: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    color: '#3B82F6'
  });

  const categoryColors = {
    personal: { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-700', hex: '#3B82F6' },
    health: { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-700', hex: '#10B981' },
    career: { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-700', hex: '#8B5CF6' },
    finance: { bg: 'bg-yellow-500', light: 'bg-yellow-100', text: 'text-yellow-700', hex: '#F59E0B' },
    education: { bg: 'bg-indigo-500', light: 'bg-indigo-100', text: 'text-indigo-700', hex: '#6366F1' },
    fitness: { bg: 'bg-red-500', light: 'bg-red-100', text: 'text-red-700', hex: '#EF4444' }
  };

  useEffect(() => {
    if (user) {
      const userGoalsKey = `goaltracker-goals-${user.id}`;
      const savedGoals = localStorage.getItem(userGoalsKey);
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const userGoalsKey = `goaltracker-goals-${user.id}`;
      localStorage.setItem(userGoalsKey, JSON.stringify(goals));
    }
  }, [goals, user]);

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (newGoal.title && newGoal.targetValue) {
      const goal = {
        ...newGoal,
        id: Date.now(),
        userId: user?.id,
        targetValue: parseFloat(newGoal.targetValue),
        currentValue: parseFloat(newGoal.currentValue || 0),
        createdAt: new Date().toISOString(),
        color: categoryColors[newGoal.category].hex
      };
      setGoals([goal, ...goals]);
      setNewGoal({
        title: '',
        description: '',
        category: 'personal',
        targetValue: '',
        currentValue: 0,
        unit: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        color: '#3B82F6'
      });
      setShowAddGoal(false);
    }
  };

  const updateGoalProgress = (goalId, newProgress) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, currentValue: Math.min(newProgress, goal.targetValue) }
        : goal
    ));
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
    setShowGoalDetails(false);
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getGoalStatus = (goal) => {
    const progress = calculateProgress(goal.currentValue, goal.targetValue);
    if (progress >= 100) return 'completed';
    if (goal.endDate && new Date(goal.endDate) < new Date()) return 'overdue';
    return 'in-progress';
  };

  const activeGoals = goals.filter(g => getGoalStatus(g) === 'in-progress').length;
  const completedGoals = goals.filter(g => getGoalStatus(g) === 'completed').length;
  const overdueGoals = goals.filter(g => getGoalStatus(g) === 'overdue').length;

  return (
    <>
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <Target className="h-8 w-8 text-indigo-600 mr-3" />
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Goal Tracker
                  </h1>
                </div>
                <div className="flex gap-4">
                  <SignInButton mode="modal">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              </div>
            </div>
          </nav>

          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Achieve Your Goals</span>
                <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Track Your Progress
                </span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Set meaningful goals, track your progress with visual insights, and celebrate your achievements.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                <SignUpButton mode="modal">
                  <button className="px-8 py-3 text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    Get Started Free
                  </button>
                </SignUpButton>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <Target className="h-8 w-8 text-indigo-600 mr-3" />
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Goal Tracker
                  </h1>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Welcome, {user?.firstName || 'User'}!
                  </span>
                  <button
                    onClick={() => setShowAddGoal(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Goal
                  </button>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white p-5 rounded-xl shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <Target className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Goals</p>
                    <p className="text-2xl font-bold">{goals.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Active</p>
                    <p className="text-2xl font-bold">{activeGoals}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-2xl font-bold">{completedGoals}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Clock className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Overdue</p>
                    <p className="text-2xl font-bold">{overdueGoals}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.length === 0 ? (
                <div className="col-span-full bg-white rounded-xl shadow p-12 text-center">
                  <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No goals yet</h3>
                  <p className="text-gray-500">Create your first goal to start tracking!</p>
                </div>
              ) : (
                goals.map((goal) => {
                  const progress = calculateProgress(goal.currentValue, goal.targetValue);
                  const status = getGoalStatus(goal);
                  const categoryStyle = categoryColors[goal.category];
                  
                  return (
                    <div
                      key={goal.id}
                      onClick={() => {
                        setSelectedGoal(goal);
                        setShowGoalDetails(true);
                      }}
                      className="bg-white rounded-xl shadow hover:shadow-xl transition-all cursor-pointer"
                    >
                      <div className={`h-2 ${categoryStyle.bg} rounded-t-xl`}></div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryStyle.light} ${categoryStyle.text} mb-2`}>
                              {goal.category}
                            </span>
                            <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Progress</span>
                            <span className="font-medium">
                              {goal.currentValue}/{goal.targetValue} {goal.unit}
                            </span>
                          </div>
                          
                          <div className="relative">
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${progress}%`, backgroundColor: goal.color }}
                                className="h-full transition-all duration-500"
                              />
                            </div>
                          </div>

                          {status === 'completed' && (
                            <div className="flex items-center text-xs text-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed!
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Add Goal Modal */}
          {showAddGoal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h3 className="text-lg font-semibold mb-4">Create New Goal</h3>
                <form onSubmit={handleAddGoal}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <input
                        type="text"
                        required
                        value={newGoal.title}
                        onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <select
                        value={newGoal.category}
                        onChange={(e) => setNewGoal({
                          ...newGoal, 
                          category: e.target.value,
                          color: categoryColors[e.target.value].hex
                        })}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="personal">Personal</option>
                        <option value="health">Health</option>
                        <option value="career">Career</option>
                        <option value="finance">Finance</option>
                        <option value="education">Education</option>
                        <option value="fitness">Fitness</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Target</label>
                        <input
                          type="number"
                          required
                          step="0.01"
                          value={newGoal.targetValue}
                          onChange={(e) => setNewGoal({...newGoal, targetValue: e.target.value})}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Unit</label>
                        <input
                          type="text"
                          value={newGoal.unit}
                          onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="hours, kg, etc"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddGoal(false)}
                      className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Goal Details Modal */}
          {showGoalDetails && selectedGoal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{selectedGoal.title}</h3>
                  <button
                    onClick={() => setShowGoalDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Progress</p>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={selectedGoal.currentValue}
                        id="progress-input"
                        className="flex-1 px-3 py-2 border rounded-md"
                      />
                      <button
                        onClick={() => {
                          const newValue = parseFloat(document.getElementById('progress-input').value);
                          if (!isNaN(newValue)) {
                            updateGoalProgress(selectedGoal.id, newValue);
                            setSelectedGoal({...selectedGoal, currentValue: newValue});
                          }
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Update
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      {selectedGoal.currentValue} / {selectedGoal.targetValue} {selectedGoal.unit}
                    </p>
                    <div className="mt-2 h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        style={{
                          width: `${calculateProgress(selectedGoal.currentValue, selectedGoal.targetValue)}%`,
                          backgroundColor: selectedGoal.color
                        }}
                        className="h-full transition-all"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => deleteGoal(selectedGoal.id)}
                    className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                  >
                    Delete Goal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </SignedIn>
    </>
  );
};

export default App;
