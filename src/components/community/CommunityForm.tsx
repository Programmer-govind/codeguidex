/**
 * Community Form Component
 * Form for creating/editing communities
 */

import { useState } from 'react';
import { Badge } from '@/components/common/Badge';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import type { Community, CreateCommunityRequest } from '@/types/community.types';

interface CommunityFormProps {
  onSubmit: (data: CreateCommunityRequest) => Promise<void>;
  initialData?: Partial<Community>;
  isLoading?: boolean;
  error?: string;
}

const CATEGORIES = ['Frontend', 'Backend', 'Mobile', 'DevOps', 'General', 'Other'];
const COLORS = [
  '#3B82F6',
  '#EF4444',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#6366F1',
];

export const CommunityForm: React.FC<CommunityFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
  error,
}) => {
  const [formData, setFormData] = useState<CreateCommunityRequest>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    tags: initialData?.tags || [],
    iconColor: initialData?.iconColor || COLORS[0],
    visibility: initialData?.visibility || 'public',
    rules: initialData?.rules || [],
    guidelines: initialData?.guidelines || '',
  });

  const [tagInput, setTagInput] = useState('');
  const [ruleInput, setRuleInput] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addTag = () => {
    if (tagInput.trim() && formData.tags.length < 10) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addRule = () => {
    if (ruleInput.trim() && formData.rules && formData.rules.length < 10) {
      setFormData((prev) => ({
        ...prev,
        rules: [...(prev.rules || []), ruleInput.trim()],
      }));
      setRuleInput('');
    }
  };

  const removeRule = (ruleToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules?.filter((rule) => rule !== ruleToRemove) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.description.length < 10) {
      alert('Description must be at least 10 characters long');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      // Error handled by parent component
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {error && <ErrorMessage message={error} type="error" />}

      {/* Basic Info */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          Community Details
        </h3>

        <div>
          <label className="block text-base font-bold text-gray-900 dark:text-white mb-3">
            Community Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., React Developers"
            required
            disabled={isLoading}
            className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all disabled:opacity-50 dark:bg-gray-800/50 dark:text-white text-base"
          />
        </div>

        <div>
          <label className="block text-base font-bold text-gray-900 dark:text-white mb-3">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your community..."
            rows={4}
            required
            disabled={isLoading}
            className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all disabled:opacity-50 dark:bg-gray-800/50 dark:text-white text-base resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-bold text-gray-900 dark:text-white mb-3">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all disabled:opacity-50 dark:bg-gray-800/50 dark:text-white text-base font-medium"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-base font-bold text-gray-900 dark:text-white mb-3">
              Visibility <span className="text-red-500">*</span>
            </label>
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all disabled:opacity-50 dark:bg-gray-800/50 dark:text-white text-base font-medium"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-base font-bold text-gray-900 dark:text-white mb-4">
            Icon Color
          </label>
          <div className="flex flex-wrap gap-4">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, iconColor: color }))
                }
                className={`w-14 h-14 rounded-2xl border-4 transition-all transform ${formData.iconColor === color
                    ? 'border-gray-900 dark:border-white scale-110 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 hover:scale-105'
                  }`}
                style={{ backgroundColor: color }}
                disabled={isLoading}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-2xl p-8 border border-purple-100 dark:border-purple-800/30">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          Tags
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add a tag..."
            disabled={isLoading || formData.tags.length >= 10}
            className="flex-1 px-5 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all disabled:opacity-50 dark:bg-gray-800/50 dark:text-white"
          />
          <button
            type="button"
            onClick={addTag}
            disabled={isLoading || formData.tags.length >= 10 || !tagInput.trim()}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {formData.tags.map((tag) => (
            <Badge
              key={tag}
              label={tag}
              variant="primary"
              size="md"
              removable
              onRemove={() => removeTag(tag)}
            />
          ))}
        </div>
      </div>

      {/* Guidelines */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          Guidelines
        </h3>
        <textarea
          name="guidelines"
          value={formData.guidelines}
          onChange={handleInputChange}
          placeholder="Write community guidelines..."
          rows={5}
          disabled={isLoading}
          className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all disabled:opacity-50 dark:bg-gray-800/50 dark:text-white text-base resize-none"
        />
      </div>

      {/* Rules */}
      <div className="space-y-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl p-8 border border-amber-100 dark:border-amber-800/30">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          Rules
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={ruleInput}
            onChange={(e) => setRuleInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addRule();
              }
            }}
            placeholder="Add a rule..."
            disabled={isLoading || (formData.rules && formData.rules.length >= 10)}
            className="flex-1 px-5 py-3 border-2 border-amber-200 dark:border-amber-700 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all disabled:opacity-50 dark:bg-gray-800/50 dark:text-white"
          />
          <button
            type="button"
            onClick={addRule}
            disabled={
              isLoading ||
              (formData.rules && formData.rules.length >= 10) ||
              !ruleInput.trim()
            }
            className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Add
          </button>
        </div>
        <div className="space-y-3">
          {formData.rules?.map((rule, idx) => (
            <div key={rule} className="flex items-start gap-3 bg-white/70 dark:bg-gray-800/50 rounded-xl p-4">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                {idx + 1}
              </div>
              <span className="flex-1 text-gray-700 dark:text-gray-300 leading-relaxed pt-1">{rule}</span>
              <button
                type="button"
                onClick={() => removeRule(rule)}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 font-bold text-xl"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4 pt-8 border-t-2 border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-8 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              Creating Community...
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Community
            </>
          )}
        </button>
      </div>
    </form>
  );
};
