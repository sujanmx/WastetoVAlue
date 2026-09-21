import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkspaceContainer } from '../components/layout/WorkspaceContainer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { services } from '../services';
import { ROUTES, ITEM_CATEGORIES, ITEM_CONDITIONS } from '../config/constants';
import { ItemCategory, ItemCondition, CircularValuePath } from '../types/item';
import { ArrowLeft, Plus } from 'lucide-react';

export const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Furniture');
  const [material, setMaterial] = useState('');
  const [condition, setCondition] = useState<ItemCondition>('Usable');
  const [description, setDescription] = useState('');
  const [selectedValuePath, setSelectedValuePath] = useState<CircularValuePath>('reuse');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await services.items.createItem({
        title,
        category,
        material: material || 'General Material',
        condition,
        description,
        selectedValuePath,
        imageUrl:
          'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=600&q=80',
      });
      navigate(ROUTES.ITEMS);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WorkspaceContainer maxWidth="md">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="tertiary"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(ROUTES.ITEMS)}
        >
          Back to items
        </Button>
      </div>

      <Card variant="raised" className="p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-primary-text mb-1">Create Item Listing</h1>
        <p className="text-xs sm:text-sm text-secondary-text mb-6">
          Manually specify details for an item if you are not utilizing the automated AI camera scan.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Item Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Vintage Dining Table"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-secondary-text">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full h-11 px-3.5 bg-surface text-primary-text border border-border rounded-input text-sm focus:border-brand-green focus:shadow-focus focus:outline-none"
              >
                {ITEM_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-secondary-text">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ItemCondition)}
                className="w-full h-11 px-3.5 bg-surface text-primary-text border border-border rounded-input text-sm focus:border-brand-green focus:shadow-focus focus:outline-none"
              >
                {ITEM_CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Primary Material"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder="e.g. Solid Pine Wood, Tempered Glass"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-secondary-text">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-surface text-primary-text border border-border rounded-input text-sm focus:border-brand-green focus:shadow-focus focus:outline-none"
              placeholder="Describe physical dimensions, wear, and structural condition..."
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-secondary-text">Preferred Value Path</label>
            <select
              value={selectedValuePath}
              onChange={(e) => setSelectedValuePath(e.target.value as CircularValuePath)}
              className="w-full h-11 px-3.5 bg-surface text-primary-text border border-border rounded-input text-sm focus:border-brand-green focus:shadow-focus focus:outline-none"
            >
              <option value="reuse">Reuse</option>
              <option value="donate">Donate</option>
              <option value="resell">Resell</option>
              <option value="recycle">Recycle</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => navigate(ROUTES.ITEMS)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create Item
            </Button>
          </div>
        </form>
      </Card>
    </WorkspaceContainer>
  );
};
