import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { 
  LoaderIcon, 
  MapPinIcon, 
  ShipWheelIcon, 
  ShuffleIcon, 
  CameraIcon,
  UserIcon,
  BookOpenIcon,
  GlobeIcon,
  MapIcon,
  LeafIcon
} from "lucide-react";
import { LANGUAGES } from "../constants";
import { Country, State, City } from "country-state-city";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("🎉 Profile onboarded successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formState.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!formState.nativeLanguage || !formState.learningLanguage) {
      toast.error("Please select both native and learning languages");
      return;
    }
    if (formState.nativeLanguage === formState.learningLanguage) {
      toast.error("Native and learning languages cannot be the same");
      return;
    }
    if (!formState.location) {
      toast.error("Please select your location");
      return;
    }

    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("✨ Random profile picture generated!");
  };

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    setSelectedState("");
    setCities([]);
    const statesList = State.getStatesOfCountry(countryCode);
    setStates(statesList);
    setFormState({ ...formState, location: "" });
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    setSelectedState(stateCode);
    setCities([]);
    const citiesList = City.getCitiesOfState(selectedCountry, stateCode);
    setCities(citiesList);
    setFormState({ ...formState, location: "" });
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    const countryName = countries.find(c => c.isoCode === selectedCountry)?.name;
    const stateName = states.find(s => s.isoCode === selectedState)?.name;
    setFormState({
      ...formState,
      location: `${cityName}, ${stateName}, ${countryName}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-stone-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Leaf Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-8 h-8 text-emerald-400 opacity-20 rotate-12">
          <LeafIcon />
        </div>
        <div className="absolute top-20 right-20 w-6 h-6 text-emerald-500 opacity-30 -rotate-45">
          <LeafIcon />
        </div>
        <div className="absolute bottom-20 left-20 w-10 h-10 text-emerald-300 opacity-25 rotate-90">
          <LeafIcon />
        </div>
        <div className="absolute bottom-10 right-10 w-7 h-7 text-emerald-400 opacity-20 -rotate-12">
          <LeafIcon />
        </div>
        <div className="absolute top-1/3 left-1/4 w-5 h-5 text-emerald-500 opacity-15 rotate-45">
          <LeafIcon />
        </div>
      </div>

      <div className="bg-gradient-to-br from-stone-800 to-emerald-900 w-full max-w-xl rounded-2xl shadow-2xl border border-emerald-700 relative z-10">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-emerald-500">
              <ShipWheelIcon className="w-8 h-8 text-emerald-100" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-green-200 bg-clip-text text-transparent">
              Welcome to the PingMe
            </h1>
            <p className="text-emerald-200 mt-2 text-lg">
              Begin your language learning journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-4 p-6 bg-stone-700/50 rounded-xl border border-emerald-700/50 backdrop-blur-sm">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-2 border-emerald-500 shadow-lg overflow-hidden bg-stone-600">
                  {formState.profilePic ? (
                    <img src={formState.profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-stone-600">
                      <CameraIcon className="w-10 h-10 text-emerald-300" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-600 rounded-full p-2 shadow-lg border border-emerald-400">
                  <UserIcon className="w-4 h-4 text-emerald-100" />
                </div>
              </div>
              <button 
                type="button" 
                onClick={handleRandomAvatar}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200 border border-emerald-500 hover:shadow-lg hover:scale-105"
              >
                <ShuffleIcon className="w-4 h-4" />
                Random Avatar
              </button>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-emerald-200">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" />
                <input
                  type="text"
                  value={formState.fullName}
                  onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 border border-emerald-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-stone-700/80 text-white placeholder-emerald-300 transition-all duration-200 backdrop-blur-sm"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-emerald-200">
                Bio
              </label>
              <textarea
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="w-full px-4 py-3.5 border border-emerald-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-stone-700/80 text-white placeholder-emerald-300 resize-none transition-all duration-200 backdrop-blur-sm"
                placeholder="Tell us about yourself and your language goals..."
                rows={3}
                maxLength={500}
              />
              <div className="text-xs text-emerald-300 text-right">
                {formState.bio.length}/500
              </div>
            </div>

            {/* Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-emerald-200">
                  Native Language
                </label>
                <div className="relative">
                  <GlobeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" />
                  <select
                    value={formState.nativeLanguage}
                    onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                    className="w-full pl-11 pr-10 py-3.5 border border-emerald-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-stone-700/80 text-white appearance-none transition-all duration-200 backdrop-blur-sm [&>option]:bg-stone-800 [&>option]:text-white"
                  >
                    <option value="">Select Native Language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang.toLowerCase()}>{lang}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-400 pointer-events-none">
                    ↑
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-emerald-200">
                  Learning Language
                </label>
                <div className="relative">
                  <BookOpenIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" />
                  <select
                    value={formState.learningLanguage}
                    onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                    className="w-full pl-11 pr-10 py-3.5 border border-emerald-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-stone-700/80 text-white appearance-none transition-all duration-200 backdrop-blur-sm [&>option]:bg-stone-800 [&>option]:text-white"
                  >
                    <option value="">Select Learning Language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang.toLowerCase()}>{lang}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-400 pointer-events-none">
                    ↑
                  </div>
                </div>
              </div>
            </div>

            {/* Location - Single Row */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-emerald-200">
                Location
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Country */}
                <div className="space-y-2">
                  <div className="relative">
                    <GlobeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-400" />
                    <select
                      value={selectedCountry}
                      onChange={handleCountryChange}
                      className="w-full pl-9 pr-8 py-3 border border-emerald-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-stone-700/80 text-white appearance-none transition-all duration-200 backdrop-blur-sm text-sm [&>option]:bg-stone-800 [&>option]:text-white"
                    >
                      <option value="">Country</option>
                      {countries.map((c) => (
                        <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-emerald-400 pointer-events-none text-sm">
                      ↑
                    </div>
                  </div>
                </div>

                {/* State */}
                <div className="space-y-2">
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-400" />
                    <select
                      value={selectedState}
                      onChange={handleStateChange}
                      disabled={!states.length}
                      className="w-full pl-9 pr-8 py-3 border border-emerald-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-stone-700/80 text-white appearance-none transition-all duration-200 backdrop-blur-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed [&>option]:bg-stone-800 [&>option]:text-white"
                    >
                      <option value="">{states.length ? "State" : "Select country"}</option>
                      {states.map((s) => (
                        <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-emerald-400 pointer-events-none text-sm">
                      ↑
                    </div>
                  </div>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-400" />
                    <select
                      onChange={handleCityChange}
                      disabled={!cities.length}
                      className="w-full pl-9 pr-8 py-3 border border-emerald-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-stone-700/80 text-white appearance-none transition-all duration-200 backdrop-blur-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed [&>option]:bg-stone-800 [&>option]:text-white"
                    >
                      <option value="">{cities.length ? "City" : "Select state"}</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.name}>{city.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-emerald-400 pointer-events-none text-sm">
                      ↑
                    </div>
                  </div>
                </div>
              </div>

              {formState.location && (
                <div className="p-3 bg-emerald-900/50 border border-emerald-600 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-sm text-emerald-200">
                    <MapPinIcon className="w-4 h-4" />
                    <span>Selected: <strong className="text-emerald-100">{formState.location}</strong></span>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl border border-emerald-500 flex items-center justify-center gap-3 text-lg"
            >
              {isPending ? (
                <>
                  <LoaderIcon className="w-5 h-5 animate-spin" />
                  Starting Your Journey...
                </>
              ) : (
                <>
                  <LeafIcon className="w-5 h-5" />
                  Begin Forest Adventure
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-emerald-700/50">
            <p className="text-xs text-emerald-300">
              Your language learning journey starts here in the forest
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;