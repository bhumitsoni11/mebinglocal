"use client";
import { useState, useEffect } from "react";
import { useUser, useUpdateUser } from "@/hooks/useUser";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

const LANGUAGES_LIST = ["English", "Spanish", "French", "Hindi", "Arabic", "Japanese", "Mandarin"];
const INTERESTS_LIST = ["Food", "History", "Nightlife", "Shopping", "Nature", "Art", "Culture"];

export function Settings() {
  const { data: user, isLoading } = useUser();
  const updateMutation = useUpdateUser();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState("MEDIUM");
  const [travelStyle, setTravelStyle] = useState("BALANCED");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setLanguages(user.languages || []);
      setInterests(user.interests || []);
      setBudget(user.budgetPreference || "MEDIUM");
      setTravelStyle(user.travelStyle || "BALANCED");
    }
  }, [user]);

  const toggle = <T,>(arr: T[], item: T, setter: (v: T[]) => void) =>
    setter(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);

  const handleSave = () => {
    updateMutation.mutate(
      { firstName, lastName, languages, interests, budgetPreference: budget, travelStyle },
      { onSuccess: () => toast.success("Settings saved successfully!") }
    );
  };

  if (isLoading) return <div className="p-10">Loading settings...</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1A3B2B", marginBottom: 24 }}>Settings</h1>
      
      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#2C4F3E] mb-2">First Name</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full rounded-xl px-4 py-3 outline-none" style={{ background: "#FCFAF5", border: "1px solid #E2E8F0" }} />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#2C4F3E] mb-2">Last Name</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full rounded-xl px-4 py-3 outline-none" style={{ background: "#FCFAF5", border: "1px solid #E2E8F0" }} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#2C4F3E] mb-2">Languages</label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES_LIST.map((lang) => (
              <button key={lang} onClick={() => toggle(languages, lang, setLanguages)} className="px-4 py-2 rounded-full border transition-colors text-sm font-medium" style={{ background: languages.includes(lang) ? "#1A3B2B" : "transparent", color: languages.includes(lang) ? "#FFF" : "#2C4F3E", borderColor: languages.includes(lang) ? "#1A3B2B" : "#CBD5E1" }}>
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#2C4F3E] mb-2">Interests</label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS_LIST.map((int) => (
              <button key={int} onClick={() => toggle(interests, int, setInterests)} className="px-4 py-2 rounded-full border transition-colors text-sm font-medium" style={{ background: interests.includes(int) ? "#C96F52" : "transparent", color: interests.includes(int) ? "#FFF" : "#C96F52", borderColor: interests.includes(int) ? "#C96F52" : "#CBD5E1" }}>
                {int}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#2C4F3E] mb-2">Budget Preference</label>
            <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full rounded-xl px-4 py-3 outline-none bg-white border border-slate-200">
              <option value="BUDGET">Budget</option>
              <option value="MEDIUM">Medium</option>
              <option value="LUXURY">Luxury</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#2C4F3E] mb-2">Travel Style</label>
            <select value={travelStyle} onChange={(e) => setTravelStyle(e.target.value)} className="w-full rounded-xl px-4 py-3 outline-none bg-white border border-slate-200">
              <option value="RELAXED">Relaxed</option>
              <option value="BALANCED">Balanced</option>
              <option value="PACKED">Packed</option>
            </select>
          </div>
        </div>

        <button onClick={handleSave} disabled={updateMutation.isPending} className="w-full mt-6 flex items-center justify-center gap-2 rounded-xl py-4" style={{ background: "#C96F52", color: "#FFF", fontWeight: 700 }}>
          {updateMutation.isPending ? "Saving..." : <><CheckCircle size={20} /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}
