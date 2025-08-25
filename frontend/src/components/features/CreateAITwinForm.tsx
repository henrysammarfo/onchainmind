'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/layout/LoadingSpinner';
import { Plus, X, Bot } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface CreateAITwinFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateAITwinForm({ onSuccess, onCancel }: CreateAITwinFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    personality: '',
    traits: [] as string[],
    skills: [] as string[]
  });
  const [newTrait, setNewTrait] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const addTrait = () => {
    if (newTrait.trim() && !formData.traits.includes(newTrait.trim())) {
      setFormData(prev => ({
        ...prev,
        traits: [...prev.traits, newTrait.trim()]
      }));
      setNewTrait('');
    }
  };

  const removeTrait = (trait: string) => {
    setFormData(prev => ({
      ...prev,
      traits: prev.traits.filter(t => t !== trait)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.personality.trim()) {
      setError('Personality description is required');
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.createAITwin(formData);
      onSuccess?.();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create AI Twin');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-blue-500" />
          <span>Create Your AI Twin</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">AI Twin Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter a unique name for your AI Twin"
              disabled={isLoading}
            />
          </div>

          {/* Personality */}
          <div>
            <label className="block text-sm font-medium mb-2">Personality Description</label>
            <textarea
              value={formData.personality}
              onChange={(e) => setFormData(prev => ({ ...prev, personality: e.target.value }))}
              placeholder="Describe your AI Twin's personality, behavior, and characteristics..."
              disabled={isLoading}
              className="w-full h-24 px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>

          {/* Traits */}
          <div>
            <label className="block text-sm font-medium mb-2">Personality Traits</label>
            <div className="flex space-x-2 mb-3">
              <Input
                value={newTrait}
                onChange={(e) => setNewTrait(e.target.value)}
                placeholder="Add a trait (e.g., curious, analytical)"
                disabled={isLoading}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTrait())}
              />
              <Button type="button" onClick={addTrait} disabled={isLoading} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.traits.map((trait) => (
                <Badge key={trait} variant="secondary" className="flex items-center space-x-1">
                  <span>{trait}</span>
                  <button
                    type="button"
                    onClick={() => removeTrait(trait)}
                    disabled={isLoading}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium mb-2">Skills & Expertise</label>
            <div className="flex space-x-2 mb-3">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill (e.g., blockchain, trading)"
                disabled={isLoading}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill} disabled={isLoading} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="flex items-center space-x-1">
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    disabled={isLoading}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creating AI Twin...
                </>
              ) : (
                'Create AI Twin'
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}