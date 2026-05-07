"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Send, AlertTriangle, CheckCircle2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";


const INITIAL_FORM = {
  company: "",
  role: "",
  level_standardized: "L3",
  location: "",
  experience_years: 0,
  base_salary: 0,
  bonus: 0,
  stock: 0,
  confidence: 100,
};

export const SubmitSalaryModal = ({ isOpen, onClose, onSuccess }: any) => {
  const [formData, setFormData] = useState({ ...INITIAL_FORM });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch(`${API_BASE_URL}/api/ingest-salary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Validation Failed");
      setStatus("success");
      onSuccess();
      setTimeout(() => {
        setFormData({ ...INITIAL_FORM });
        setStatus("idle");
        onClose();
      }, 2000);
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const handleClose = () => {
    setFormData({ ...INITIAL_FORM });
    setStatus("idle");
    onClose();
  };

  if (!isOpen) return null;

  const totalComp = formData.base_salary + formData.bonus + formData.stock;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] border border-slate-200"
      >
        <div className="p-6 md:p-8">
          <button 
            onClick={handleClose} 
            className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-100"
          >
            <X size={20} />
          </button>

          <header className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Submit Compensation Data</h2>
            <p className="text-slate-500 text-sm mt-1">All submissions are validated and normalized before storage.</p>
          </header>

          {status === "success" ? (
            <div className="py-16 text-center space-y-3">
              <CheckCircle2 size={48} className="text-emerald-500 mx-auto" />
              <h3 className="text-xl font-semibold text-slate-900">Submitted Successfully</h3>
              <p className="text-slate-500 text-sm">Your data has been added to the system.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-700 font-medium">Company</label>
                  <input
                    required
                    type="text"
                    value={formData.company}
                    placeholder="e.g. Google"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400"
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-700 font-medium">Role</label>
                  <input
                    required
                    type="text"
                    value={formData.role}
                    placeholder="e.g. Software Engineer"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400"
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-700 font-medium">Level</label>
                  <select
                    value={formData.level_standardized}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900"
                    onChange={(e) => setFormData({ ...formData, level_standardized: e.target.value })}
                  >
                    <option value="L3">L3 — Junior</option>
                    <option value="L4">L4 — Mid-Level</option>
                    <option value="L5">L5 — Senior</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-700 font-medium">Years of Experience</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={formData.experience_years || ""}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900"
                    onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm text-slate-700 font-medium">Location</label>
                  <input
                    required
                    type="text"
                    value={formData.location}
                    placeholder="e.g. Bangalore, IN"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400"
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Compensation Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm text-slate-700 font-medium">Base Salary ($)</label>
                    <input
                      required
                      type="number"
                      min="1"
                      value={formData.base_salary || ""}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900"
                      onChange={(e) => setFormData({ ...formData, base_salary: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm text-slate-700 font-medium">Annual Bonus ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.bonus || ""}
                      placeholder="0"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900"
                      onChange={(e) => setFormData({ ...formData, bonus: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm text-slate-700 font-medium">Stock per Year ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock || ""}
                      placeholder="0"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900"
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>

              {(formData.base_salary > 0) && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  <p className="text-xs text-slate-500 font-medium mb-1">Estimated Total Compensation</p>
                  <p className="text-2xl font-bold text-slate-900">${totalComp.toLocaleString()}</p>
                </div>
              )}

              <div className="pt-2">
                <button
                  disabled={status === "submitting"}
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
                >
                  {status === "submitting" ? (
                    <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                  ) : (
                    <>
                      <Send size={16} /> Submit Salary
                    </>
                  )}
                </button>
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 text-red-600 justify-center text-sm font-medium">
                  <AlertTriangle size={16} /> Submission failed. Please check your data and try again.
                </div>
              )}
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
