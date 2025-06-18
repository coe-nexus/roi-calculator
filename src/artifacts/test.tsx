import { useState, useEffect, SetStateAction } from 'react';
import { Heart, Star, ThumbsUp, Zap, TrendingUp, Users, Bell, Settings } from 'lucide-react';

export default function InteractiveDashboard() {
  const [likes, setLikes] = useState(42);
  const [isLiked, setIsLiked] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [counter, setCounter] = useState(0);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(3);
  const [progress, setProgress] = useState(65);
  const [username, setUsername] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-incrementing progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => prev >= 100 ? 0 : prev + 1);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleStarClick = (starIndex: SetStateAction<number>) => {
    setRating(starIndex);
  };

  const clearNotifications = () => {
    setNotifications(0);
  };

  const themeClasses = theme === 'dark' 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800';

  return (
    <div className={`min-h-screen p-6 transition-all duration-500 ${themeClasses}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Interactive Dashboard
            </h1>
            <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Explore various interactive components
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={`p-2 rounded-lg transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                  : 'bg-white hover:bg-gray-100 text-gray-600 shadow-md'
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>
            
            <div className="relative">
              <button
                onClick={clearNotifications}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-white hover:bg-gray-100 shadow-md'
                }`}
              >
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Like Button Card */}
          <div className={`p-6 rounded-2xl shadow-lg transition-all duration-300 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Social Interactions
            </h3>
            <div className="text-center">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 mx-auto px-6 py-3 rounded-full transition-all duration-300 transform ${
                  isLiked 
                    ? 'bg-red-500 text-white scale-110' 
                    : theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                } ${isAnimating ? 'animate-bounce' : ''}`}
              >
                <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                {likes}
              </button>
            </div>
          </div>

          {/* Star Rating Card */}
          <div className={`p-6 rounded-2xl shadow-lg transition-all duration-300 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Rating System
            </h3>
            <div className="flex justify-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="transition-all duration-200 hover:scale-125"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredStar || rating)
                        ? 'text-yellow-400 fill-current'
                        : theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-sm">
              {rating > 0 ? `You rated ${rating}/5 stars` : 'Click to rate'}
            </p>
          </div>

          {/* Counter Card */}
          <div className={`p-6 rounded-2xl shadow-lg transition-all duration-300 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              Counter
            </h3>
            <div className="text-center">
              <div className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {counter}
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setCounter(prev => prev - 1)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-red-100 hover:bg-red-200 text-red-700'
                  }`}
                >
                  -
                </button>
                <button
                  onClick={() => setCounter(0)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Reset
                </button>
                <button
                  onClick={() => setCounter(prev => prev + 1)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-green-100 hover:bg-green-200 text-green-700'
                  }`}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Progress Card */}
          <div className={`p-6 rounded-2xl shadow-lg transition-all duration-300 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Progress Tracker
            </h3>
            <div className="mb-2 flex justify-between text-sm">
              <span>Loading...</span>
              <span>{progress}%</span>
            </div>
            <div className={`w-full h-3 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div
                className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Input Card */}
          <div className={`p-6 rounded-2xl shadow-lg transition-all duration-300 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              User Input
            </h3>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name..."
              className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-300'
              }`}
            />
            {username && (
              <p className="mt-3 text-center text-sm animate-fade-in">
                Hello, <span className="font-semibold text-purple-600">{username}</span>! 👋
              </p>
            )}
          </div>

          {/* Stats Card */}
          <div className={`p-6 rounded-2xl shadow-lg transition-all duration-300 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-lg font-semibold mb-4">Dashboard Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Total Likes:</span>
                <span className="font-semibold">{likes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Current Rating:</span>
                <span className="font-semibold">{rating}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Counter Value:</span>
                <span className="font-semibold">{counter}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Theme:</span>
                <span className="font-semibold capitalize">{theme}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Try interacting with all the components above! ✨
          </p>
        </div>
      </div>
    </div>
  );
}