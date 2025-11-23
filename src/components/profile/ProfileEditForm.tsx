/**
 * Profile Edit Form Component
 * Form for editing user profile
 */

import { useState } from 'react';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Badge } from '@/components/common/Badge';
import type { User } from '@/types/user.types';

interface ProfileEditFormProps {
  profile: User;
  onSubmit: (data: Partial<User>) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  onCancel?: () => void;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  profile,
  onSubmit,
  isLoading = false,
  error,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<User>>({
    displayName: profile.displayName,
    bio: profile.bio,
    skills: profile.skills || [],
    learningGoals: profile.learningGoals || [],
  });

  const [skillInput, setSkillInput] = useState('');
  const [goalInput, setGoalInput] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (skillInput.trim() && formData.skills && formData.skills.length < 20) {
      setFormData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills?.filter((s) => s !== skillToRemove) || [],
    }));
  };

  const addGoal = () => {
    if (goalInput.trim() && formData.learningGoals && formData.learningGoals.length < 10) {
      setFormData((prev) => ({
        ...prev,
        learningGoals: [...(prev.learningGoals || []), goalInput.trim()],
      }));
      setGoalInput('');
    }
  };

  const removeGoal = (goalToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      learningGoals: prev.learningGoals?.filter((g) => g !== goalToRemove) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (err) {
      // Error handled by parent component
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg border border-gray-200 p-6">
      {error && <ErrorMessage message={error} type="error" />}

      {/* Display Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Display Name *
        </label>
        <input
          type="text"
          name="displayName"
          value={formData.displayName}
          onChange={handleInputChange}
          placeholder="Your display name"
          required
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          placeholder="Tell us about yourself..."
          rows={4}
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
        />
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="Add a skill..."
            disabled={isLoading || (formData.skills && formData.skills.length >= 20)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            type="button"
            onClick={addSkill}
            disabled={
              isLoading ||
              (formData.skills && formData.skills.length >= 20) ||
              !skillInput.trim()
            }
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.skills?.map((skill) => (
            <Badge
              key={skill}
              label={skill}
              variant="primary"
              removable
              onRemove={() => removeSkill(skill)}
            />
          ))}
        </div>
      </div>

      {/* Learning Goals */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Learning Goals
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addGoal();
              }
            }}
            placeholder="Add a learning goal..."
            disabled={isLoading || (formData.learningGoals && formData.learningGoals.length >= 10)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            type="button"
            onClick={addGoal}
            disabled={
              isLoading ||
              (formData.learningGoals && formData.learningGoals.length >= 10) ||
              !goalInput.trim()
            }
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.learningGoals?.map((goal) => (
            <Badge
              key={goal}
              label={goal}
              variant="success"
              removable
              onRemove={() => removeGoal(goal)}
            />
          ))}
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
