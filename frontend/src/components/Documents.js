import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import axios from 'axios';
import DashboardLayout from './DashboardLayout';
import { Icons, getDocumentCategoryIcon } from './ui/icons';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [stats, setStats] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [newFilename, setNewFilename] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);

  const fileInputRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const categories = [
    { value: 'all', label: 'Tous les documents', icon: Icons.Document },
    { value: 'salary_slip', label: 'Bulletins de salaire', icon: Icons.Money },
    { value: 'career_statement', label: 'Relevés de carrière', icon: Icons.Chart },
    { value: 'tax_declaration', label: 'Déclarations fiscales', icon: Icons.Stats },
    { value: 'retirement_contract', label: 'Contrats de retraite', icon: Icons.Bank },
    { value: 'other', label: 'Autres documents', icon: Icons.Folder }
  ];

  useEffect(() => {
    fetchDocuments();
    fetchStats();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [selectedCategory, documents]);

  const fetchDocuments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API}/documents`);
      setDocuments(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des documents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/documents/stats/summary`);
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const filterDocuments = () => {
    if (selectedCategory === 'all') {
      setFilteredDocuments(documents);
    } else {
      setFilteredDocuments(documents.filter(doc => doc.category === selectedCategory));
    }
  };

  const handleFileSelect = (files) => {
    const file = files[0];
    if (!file) return;

    // Validate PDF
    if (file.type !== 'application/pdf') {
      setError('Seuls les fichiers PDF sont acceptés');
      return;
    }

    // Validate size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Le fichier est trop volumineux. Taille maximale : 10MB');
      return;
    }

    uploadFile(file);
  };

  const uploadFile = async (file) => {
    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', selectedCategory === 'all' ? 'other' : selectedCategory);

    try {
      await axios.post(`${API}/documents/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Document uploadé avec succès !');
      fetchDocuments();
      fetchStats();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de l\'upload du document');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDownload = async (docId, filename) => {
    try {
      const response = await axios.get(`${API}/documents/${docId}/download`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Erreur lors du téléchargement');
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      return;
    }

    try {
      await axios.delete(`${API}/documents/${docId}`);
      setSuccess('Document supprimé avec succès');
      fetchDocuments();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  const startRename = (doc) => {
    setEditingDoc(doc.id);
    setNewFilename(doc.filename.replace('.pdf', ''));
  };

  const handleRename = async (docId) => {
    if (!newFilename.trim()) {
      setError('Le nom du fichier ne peut pas être vide');
      return;
    }

    try {
      await axios.patch(`${API}/documents/${docId}`, {
        filename: newFilename.trim() + '.pdf'
      });

      setSuccess('Document renommé avec succès');
      setEditingDoc(null);
      setNewFilename('');
      fetchDocuments();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erreur lors du renommage');
    }
  };

  const handleCategoryChange = async (docId, newCategory) => {
    try {
      await axios.patch(`${API}/documents/${docId}`, {
        category: newCategory
      });

      setSuccess('Catégorie mise à jour');
      fetchDocuments();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erreur lors de la mise à jour');
    }
  };

  const openPreview = async (docId) => {
    try {
      const response = await axios.get(`${API}/documents/${docId}/download`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setPreviewDoc(url);
    } catch (err) {
      setError('Erreur lors de l\'ouverture du document');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryLabel = (value) => {
    const category = categories.find(cat => cat.value === value);
    return category ? category.label : value;
  };

  const getCategoryIcon = (value) => {
    const category = categories.find(cat => cat.value === value);
    return category ? category.icon : Icons.Document;
  };

  return (
    <DashboardLayout title="Mes Documents">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-elysion-primary mb-2">
            Mes Documents
          </h1>
          <p className="text-gray-600">
            Gérez vos documents de retraite en toute sécurité
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="mb-2"><Icons.Document size={28} className="text-blue-600" /></div>
              <div className="text-2xl font-bold text-elysion-primary">{stats.total_documents}</div>
              <div className="text-sm text-gray-600">Documents totaux</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="mb-2"><Icons.Download size={28} className="text-green-600" /></div>
              <div className="text-2xl font-bold text-elysion-primary">{stats.total_size_mb} MB</div>
              <div className="text-sm text-gray-600">Espace utilisé</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="mb-2"><Icons.Add size={28} className="text-orange-600" /></div>
              <div className="text-2xl font-bold text-elysion-primary">{stats.recent_count}</div>
              <div className="text-sm text-gray-600">Cette semaine</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="mb-2"><Icons.Folder size={28} className="text-purple-600" /></div>
              <div className="text-2xl font-bold text-elysion-primary">
                {Object.keys(stats.by_category || {}).length}
              </div>
              <div className="text-sm text-gray-600">Catégories</div>
            </div>
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Upload Zone */}
        <div className="mb-8">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging
                ? 'border-elysion-primary bg-elysion-primary-50'
                : 'border-gray-300 bg-white hover:border-elysion-primary'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mb-4 flex justify-center"><Icons.Upload size={48} className="text-elysion-primary" /></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {uploading ? 'Upload en cours...' : 'Glissez-déposez votre document PDF ici'}
            </h3>
            <p className="text-gray-600 mb-4">ou</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn-primary"
            >
              {uploading ? 'Upload en cours...' : 'Choisir un fichier'}
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Format accepté : PDF uniquement • Taille max : 10 MB
            </p>
          </div>
        </div>

        {/* Category Filter - Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-0 overflow-x-auto" aria-label="Catégories">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`relative flex items-center gap-2 px-4 sm:px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category.value
                        ? 'text-elysion-primary border-b-2 border-elysion-primary'
                        : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent size={16} />
                    {category.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des documents...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mb-4 flex justify-center"><Icons.Folder size={48} className="text-gray-400" /></div>
              <p className="text-gray-600">
                {selectedCategory === 'all'
                  ? 'Aucun document uploadé'
                  : `Aucun document dans la catégorie "${getCategoryLabel(selectedCategory)}"`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredDocuments.map((doc) => {
                const DocIcon = getCategoryIcon(doc.category);
                return (
                  <div key={doc.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-12 h-12 bg-elysion-primary/10 rounded-lg flex items-center justify-center">
                          <DocIcon size={24} className="text-elysion-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {editingDoc === doc.id ? (
                            <div className="flex items-center space-x-2 mb-2">
                              <input
                                type="text"
                                value={newFilename}
                                onChange={(e) => setNewFilename(e.target.value)}
                                className="input-text flex-1"
                                autoFocus
                              />
                              <button
                                onClick={() => handleRename(doc.id)}
                                className="btn-primary btn-sm"
                              >
                                <Icons.Check size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingDoc(null);
                                  setNewFilename('');
                                }}
                                className="btn-outline btn-sm"
                              >
                                <Icons.Close size={16} />
                              </button>
                            </div>
                          ) : (
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                              {doc.filename}
                            </h3>
                          )}

                          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                            <span>{formatFileSize(doc.file_size)}</span>
                            <span>•</span>
                            <span>{formatDate(doc.uploaded_at)}</span>
                            <span>•</span>
                            <select
                              value={doc.category}
                              onChange={(e) => handleCategoryChange(doc.id, e.target.value)}
                              className="text-sm border-none bg-transparent cursor-pointer hover:text-elysion-primary"
                            >
                              {categories.filter(c => c.value !== 'all').map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                  {cat.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => openPreview(doc.id)}
                          className="p-2 text-gray-600 hover:text-elysion-primary hover:bg-elysion-primary-50 rounded-lg transition-colors"
                          title="Prévisualiser"
                        >
                          <Icons.View size={18} />
                        </button>
                        <button
                          onClick={() => handleDownload(doc.id, doc.filename)}
                          className="p-2 text-gray-600 hover:text-elysion-primary hover:bg-elysion-primary-50 rounded-lg transition-colors"
                          title="Télécharger"
                        >
                          <Icons.Download size={18} />
                        </button>
                        <button
                          onClick={() => startRename(doc)}
                          className="p-2 text-gray-600 hover:text-elysion-primary hover:bg-elysion-primary-50 rounded-lg transition-colors"
                          title="Renommer"
                        >
                          <Icons.Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Icons.Delete size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">Prévisualisation</h3>
              <button
                onClick={() => {
                  window.URL.revokeObjectURL(previewDoc);
                  setPreviewDoc(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Icons.Close size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={previewDoc}
                className="w-full h-full"
                title="Document Preview"
              />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Documents;