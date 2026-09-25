import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkspaceContainer } from '../components/layout/WorkspaceContainer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { StateView } from '../components/feedback/StateView';
import { useAsync } from '../hooks/useAsync';
import { services, AppError } from '../services';
import { ROUTES, ITEM_CATEGORIES, ITEM_CONDITIONS } from '../config/constants';
import { formatDate } from '../lib/formatters';
import { WasteItem, ItemCategory, ItemCondition, CircularValuePath } from '../types/item';
import { Camera, Plus, Eye, Pencil, Trash2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { cn } from '../lib/utils';

export const ItemsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'all' | 'active' | 'completed'>('all');

  // Stable fetch function reference prevents useAsync from infinite re-execution
  const fetchItems = useCallback(() => services.items.getItems(), []);

  const { data: items, isLoading, error, reload } = useAsync(
    fetchItems,
    { immediate: true }
  );

  // Edit modal state
  const [editingItem, setEditingItem] = useState<WasteItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<ItemCategory>('Furniture');
  const [editMaterial, setEditMaterial] = useState('');
  const [editCondition, setEditCondition] = useState<ItemCondition>('Usable');
  const [editDescription, setEditDescription] = useState('');
  const [editValuePath, setEditValuePath] = useState<CircularValuePath>('reuse');
  const [isEditLoading, setIsEditLoading] = useState(false);

  // Delete state
  const [deletingItem, setDeletingItem] = useState<WasteItem | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Feedback state
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filteredItems = items?.filter((item) => {
    if (tab === 'active') return item.status !== 'completed' && item.status !== 'cancelled';
    if (tab === 'completed') return item.status === 'completed';
    return true;
  });

  const openEditModal = (item: WasteItem) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditCategory(item.category);
    setEditMaterial(item.material);
    setEditCondition(item.condition);
    setEditDescription(item.description || '');
    setEditValuePath(item.selectedValuePath || item.recommendedValuePath);
    setFeedback(null);
  };

  const handleEditSave = async () => {
    if (!editingItem) return;
    setIsEditLoading(true);
    setFeedback(null);
    try {
      await services.items.updateItem(editingItem.id, {
        title: editTitle,
        category: editCategory,
        material: editMaterial,
        condition: editCondition,
        description: editDescription,
        selectedValuePath: editValuePath,
      });
      setEditingItem(null);
      setFeedback({ type: 'success', message: 'Item updated successfully.' });
      await reload();
    } catch (err: unknown) {
      const appError =
        err instanceof AppError
          ? err
          : new AppError({
              message: err instanceof Error ? err.message : 'An error occurred',
              code: 'UNKNOWN_ERROR',
            });
      setFeedback({ type: 'error', message: appError.userMessage });
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setIsDeleteLoading(true);
    setFeedback(null);
    try {
      await services.items.deleteItem(deletingItem.id);
      setDeletingItem(null);
      setFeedback({ type: 'success', message: 'Item deleted successfully.' });
      await reload();
    } catch (err: unknown) {
      const appError =
        err instanceof AppError
          ? err
          : new AppError({
              message: err instanceof Error ? err.message : 'An error occurred',
              code: 'UNKNOWN_ERROR',
            });
      setFeedback({ type: 'error', message: appError.userMessage });
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <WorkspaceContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-text">My Items</h1>
          <p className="text-sm text-secondary-text mt-1">
            Track and manage your scanned items across their circular lifecycles.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate(ROUTES.CREATE_LISTING)}
          >
            Create Listing
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Camera className="w-4 h-4" />}
            onClick={() => navigate(ROUTES.SCAN)}
          >
            Scan New Item
          </Button>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={cn(
            'mb-4 p-3 rounded-input flex items-center justify-between text-sm',
            feedback.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          )}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-current opacity-60 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border/60 mb-6 gap-6 text-sm font-medium">
        {(['all', 'active', 'completed'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'pb-3 capitalize transition-colors relative',
              tab === t
                ? 'text-brand-green font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-green'
                : 'text-secondary-text hover:text-primary-text'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Desktop Table / Mobile Card Hybrid */}
      <StateView
        isLoading={isLoading}
        error={error}
        onRetry={reload}
        isEmpty={filteredItems?.length === 0}
        emptyProps={{
          title: 'No items found',
          description: 'Your circular inventory is empty. Start by scanning your first item.',
          actionLabel: 'Scan Your Waste',
          onAction: () => navigate(ROUTES.SCAN),
        }}
      >
        {/* Desktop Table (Visible on lg+) */}
        <div className="hidden lg:block bg-surface border border-border rounded-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas border-b border-border text-secondary-text uppercase font-semibold">
              <tr>
                <th className="p-4">Item</th>
                <th className="p-4">Category</th>
                <th className="p-4">Value Path</th>
                <th className="p-4">Receiver Hub</th>
                <th className="p-4">Status</th>
                <th className="p-4">Updated</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredItems?.map((item) => (
                <tr key={item.id} className="hover:bg-canvas/50 transition-colors">
                  <td className="p-4 font-semibold text-primary-text flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-10 h-10 rounded-control object-cover border border-border"
                    />
                    <span>{item.title}</span>
                  </td>
                  <td className="p-4 text-secondary-text">{item.category}</td>
                  <td className="p-4 font-semibold text-brand-green uppercase">
                    {item.recommendedValuePath}
                  </td>
                  <td className="p-4 text-primary-text font-medium">
                    {item.receiverName || 'Not matched yet'}
                  </td>
                  <td className="p-4">
                    <span className="capitalize text-secondary-text">{item.status.replace('_', ' ')}</span>
                  </td>
                  <td className="p-4 text-secondary-text font-mono">
                    {formatDate(item.updatedAt)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="secondary"
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                        onClick={() => navigate(`/items/${item.id}/track`)}
                      >
                        Track
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        leftIcon={<Pencil className="w-3.5 h-3.5" />}
                        onClick={() => openEditModal(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                        onClick={() => setDeletingItem(item)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards (Visible on <lg) */}
        <div className="lg:hidden space-y-3">
          {filteredItems?.map((item) => (
            <Card
              key={item.id}
              variant="interactive"
              className="p-4 flex items-center justify-between gap-3"
            >
              <div
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                onClick={() => navigate(`/items/${item.id}/track`)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-12 h-12 rounded-input object-cover border border-border"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-primary-text truncate">{item.title}</h4>
                  <p className="text-xs text-secondary-text mt-0.5">
                    {item.category} •{' '}
                    <span className="text-brand-green font-semibold uppercase">
                      {item.recommendedValuePath}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 rounded-control text-secondary-text hover:text-primary-text hover:bg-canvas transition-colors"
                  title="Edit item"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletingItem(item)}
                  className="p-2 rounded-control text-secondary-text hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </StateView>

      {/* Edit Modal */}
      {editingItem && (
        <Modal isOpen onClose={() => setEditingItem(null)} title="Edit Item">
          <div className="space-y-4">
            <Input
              label="Item Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-secondary-text">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as ItemCategory)}
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
                  value={editCondition}
                  onChange={(e) => setEditCondition(e.target.value as ItemCondition)}
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
              value={editMaterial}
              onChange={(e) => setEditMaterial(e.target.value)}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-secondary-text">Description</label>
              <textarea
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full p-3 bg-surface text-primary-text border border-border rounded-input text-sm focus:border-brand-green focus:shadow-focus focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-secondary-text">Value Path</label>
              <select
                value={editValuePath}
                onChange={(e) => setEditValuePath(e.target.value as CircularValuePath)}
                className="w-full h-11 px-3.5 bg-surface text-primary-text border border-border rounded-input text-sm focus:border-brand-green focus:shadow-focus focus:outline-none"
              >
                <option value="reuse">Reuse</option>
                <option value="donate">Donate</option>
                <option value="resell">Resell</option>
                <option value="recycle">Recycle</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                isLoading={isEditLoading}
                onClick={handleEditSave}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <Modal isOpen onClose={() => setDeletingItem(null)} title="Delete Item">
          <div className="space-y-4">
            <p className="text-sm text-secondary-text">
              Are you sure you want to delete <strong className="text-primary-text">{deletingItem.title}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setDeletingItem(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                isLoading={isDeleteLoading}
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 border-red-600"
              >
                Delete Item
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </WorkspaceContainer>
  );
};
