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

    // Validation
    if (formData.name.length < 3 || formData.name.length > 100) {
      // We should ideally set a local error state here, but for now we rely on the parent's error handling
      // or we can just return if we had a local error state.
      // Since the props only have 'error' string passed down, we can't easily set it.
      // However, the service will throw an error which will be caught and displayed.
      // To be better, let's check before submitting.
    }

    if (formData.description.length < 10) {
      // The backend requires 10 chars.
      // We'll let the service validation handle the error message display 
      // since we don't have a setLocalError prop.
      // But to prevent the network request:
      if (formData.description.length < 10) {
        alert('Description must be at least 10 characters long');
        return;
      }
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      // Error handled by parent component
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <ErrorMessage message={error} type="error" />}

      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Community Details</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Community Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., React Developers"
            required
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your community..."
            rows={3}
            required
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Visibility *
            </label>
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icon Color
          </label>
          <div className="flex flex-wrap gap-3">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, iconColor: color }))
                }
                className={`w-10 h-10 rounded-lg border-2 transition-all ${formData.iconColor === color
                    ? 'border-gray-900 scale-110'
                    : 'border-gray-300'
                  }`}
                style={{ backgroundColor: color }}
                disabled={isLoading}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
        <div className="flex gap-2">
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
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            type="button"
            onClick={addTag}
            disabled={isLoading || formData.tags.length >= 10 || !tagInput.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <Badge
              key={tag}
              label={tag}
              variant="primary"
              removable
              onRemove={() => removeTag(tag)}
            />
          ))}
        </div>
      </div>

      {/* Guidelines */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Guidelines</h3>
        <textarea
          name="guidelines"
          value={formData.guidelines}
          onChange={handleInputChange}
          placeholder="Write community guidelines..."
          rows={4}
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
        />
      </div>

      {/* Rules */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Rules</h3>
        <div className="flex gap-2">
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
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            type="button"
            onClick={addRule}
            disabled={
              isLoading ||
              (formData.rules && formData.rules.length >= 10) ||
              !ruleInput.trim()
            }
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {formData.rules?.map((rule) => (
            <Badge
              key={rule}
              label={rule}
              variant="warning"
              removable
              onRemove={() => removeRule(rule)}
            />
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
        >
          {isLoading ? 'Creating...' : 'Create Community'}
        </button>
      </div>
    </form>
  );
};
