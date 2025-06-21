import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, MapPin, Clock, Zap, TrendingUp, User, Home, Activity, Map } from 'lucide-react';

const CyclingApp = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isTracking, setIsTracking] = useState(false);
  const [trackingData, setTrackingData] = useState({
    distance: 0,
    duration: 0,
    speed: 0,
    calories: 0
  });

  useEffect(() => {
    let interval;
    if (isTracking) {
      interval = setInterval(() => {
        setTrackingData(prev => ({
          distance: prev.distance + Math.random() * 0.1,
          duration: prev.duration + 1,
          speed: 15 + Math.random() * 10,
          calories: prev.calories + Math.random() * 2
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsTracking(!isTracking);
  };

  const handleReset = () => {
    setIsTracking(false);
    setTrackingData({ distance: 0, duration: 0, speed: 0, calories: 0 });
  };

  const NavBar = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 max-w-md mx-auto">
      <div className="flex justify-around">
        {[
          { id: 'home', icon: Home, label: 'Home' },
          { id: 'track', icon: Activity, label: 'Track' },
          { id: 'map', icon: Map, label: 'Routes' },
          { id: 'profile', icon: User, label: 'Profile' }
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setCurrentScreen(id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              currentScreen === id ? 'text-green-600' : 'text-gray-500'
            }`}
          >
            <Icon size={24} />
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const HomeScreen = () => (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">CycleTrack</h1>
        <p className="text-gray-600">Ready for your next ride?</p>
      </div>

      <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">Today's Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-green-100">Distance</p>
            <p className="text-2xl font-bold">12.5 km</p>
          </div>
          <div>
            <p className="text-green-100">Time</p>
            <p className="text-2xl font-bold">45 min</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
        {[
          { date: 'Today', distance: '8.2 km', time: '28 min' },
          { date: 'Yesterday', distance: '15.6 km', time: '52 min' },
          { date: '2 days ago', distance: '6.8 km', time: '22 min' }
        ].map((ride, index) => (
          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{ride.date}</p>
                <p className="text-sm text-gray-600">{ride.distance} • {ride.time}</p>
              </div>
              <Activity className="text-green-500" size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TrackScreen = () => (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Track Your Ride</h2>
        <p className="text-gray-600">Start tracking your cycling session</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <MapPin className="text-green-500 mr-2" size={20} />
              <span className="text-sm text-gray-600">Distance</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{trackingData.distance.toFixed(1)} km</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="text-green-500 mr-2" size={20} />
              <span className="text-sm text-gray-600">Time</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{formatTime(trackingData.duration)}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="text-green-500 mr-2" size={20} />
              <span className="text-sm text-gray-600">Speed</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{trackingData.speed.toFixed(1)} km/h</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="text-green-500 mr-2" size={20} />
              <span className="text-sm text-gray-600">Calories</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{Math.round(trackingData.calories)}</p>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleStartStop}
            className={`flex items-center px-6 py-3 rounded-full font-semibold transition-colors ${
              isTracking 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isTracking ? <Pause className="mr-2" size={20} /> : <Play className="mr-2" size={20} />}
            {isTracking ? 'Pause' : 'Start'}
          </button>
          
          <button
            onClick={handleReset}
            className="flex items-center px-6 py-3 rounded-full font-semibold bg-gray-500 hover:bg-gray-600 text-white transition-colors"
          >
            <Square className="mr-2" size={20} />
            Reset
          </button>
        </div>
      </div>

      {isTracking && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-center font-medium">🚴‍♂️ Tracking in progress...</p>
        </div>
      )}
    </div>
  );

  const MapScreen = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Routes & Maps</h2>
      
      <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <Map size={48} className="mx-auto mb-2" />
          <p>Interactive map view</p>
          <p className="text-sm">GPS tracking & route visualization</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Saved Routes</h3>
        {[
          { name: 'Morning Loop', distance: '8.5 km', difficulty: 'Easy' },
          { name: 'Hill Challenge', distance: '15.2 km', difficulty: 'Hard' },
          { name: 'Park Circuit', distance: '6.8 km', difficulty: 'Moderate' }
        ].map((route, index) => (
          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{route.name}</p>
                <p className="text-sm text-gray-600">{route.distance} • {route.difficulty}</p>
              </div>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                Start
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ProfileScreen = () => (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <User className="text-white" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Aarav Lakhani</h2>
        <p className="text-gray-600">Cycling Enthusiast</p>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">156</p>
            <p className="text-sm text-gray-600">Total Rides</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">2,340</p>
            <p className="text-sm text-gray-600">Total km</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">89</p>
            <p className="text-sm text-gray-600">Hours</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">12.5</p>
            <p className="text-sm text-gray-600">Avg Speed</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">Settings</h3>
        {[
          'Notification Preferences',
          'Privacy Settings',
          'Units & Measurements',
          'Export Data',
          'Help & Support'
        ].map((setting, index) => (
          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <p className="text-gray-800">{setting}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const screens = {
    home: <HomeScreen />,
    track: <TrackScreen />,
    map: <MapScreen />,
    profile: <ProfileScreen />
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
      <div className="pb-20">
        {screens[currentScreen]}
      </div>
      <NavBar />
    </div>
  );
};

export default CyclingApp;
