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
    { value: 'all', label: 'Tous les documents', icon: Icons.Documents },
    { value: 'salary_slip', label: 'Bulletins de salaire', icon: Icons.Money },
    { value: 'career_statement', label: 'Relevés de carrière', icon: Icons.Chart },
    { value: 'tax_declaration', label: 'Déclarations fiscales', icon: Icons.Stats },
    { value: 'retirement_contract', label: 'Contrats de retraite', icon: Icons.Bank },
    { value: 'other', label: 'Autres documents', icon: Icons.Document }
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
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Erreur lors du téléchargement');
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;

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

  const startEditing = (doc) => {
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
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryLabel = (value) => {
    const cat = categories.find(c => c.value === value);
    return cat ? cat.label : value;
  };

  return (
    <DashboardLayout title="Mes Documents">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-elysion-primary mb-2">
            Mes Documents
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Gérez vos documents de retraite en toute sécurité
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow">
              <div className="w-10 h-10 mb-2 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icons.Documents size={20} className="text-blue-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-elysion-primary">{stats.total_documents}</div>
              <div className="text-xs sm:text-sm text-gray-600">Documents totaux</div>
            </div>
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow">
              <div className="w-10 h-10 mb-2 bg-green-100 rounded-lg flex items-center justify-center">
                <Icons.Money size={20} className="text-green-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-elysion-primary">{stats.by_category?.salary_slip || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600">Bulletins de salaire</div>
            </div>
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow">
              <div className="w-10 h-10 mb-2 bg-purple-100 rounded-lg flex items-center justify-center">
                <Icons.Chart size={20} className="text-purple-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-elysion-primary">{stats.by_category?.career_statement || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600">Relevés de carrière</div>
            </div>
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow">
              <div className="w-10 h-10 mb-2 bg-orange-100 rounded-lg flex items-center justify-center">
                <Icons.Bank size={20} className="text-orange-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-elysion-primary">{formatFileSize(stats.total_size || 0)}</div>
              <div className="text-xs sm:text-sm text-gray-600">Espace utilisé</div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-6">
          <nav className="flex flex-wrap gap-2" aria-label="Catégories de documents">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat.value
                      ? 'bg-elysion-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <IconComponent size={16} />
                  <span className="hidden sm:inline">{cat.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <Icons.Error size={20} />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <Icons.Success size={20} />
            {success}
          </div>
        )}

        {/* Upload Zone */}
        <div className="mb-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging
                ? 'border-elysion-primary bg-elysion-primary-50'
                : 'border-gray-300 bg-gray-50 hover:border-elysion-primary hover:bg-elysion-primary-50'
            }`}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-elysion-primary/10 rounded-2xl flex items-center justify-center">
              <Icons.Upload size={32} className="text-elysion-primary" />
            </div>
            <p className="text-lg font-semibold text-gray-700 mb-2">
              {uploading ? 'Upload en cours...' : 'Glissez-déposez votre document ici'}
            </p>
            <p className="text-sm text-gray-500 mb-4">ou</p>
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
              {uploading ? 'Chargement...' : 'Parcourir les fichiers'}
            </button>
            <p className="text-xs text-gray-400 mt-4">
              Formats acceptés : PDF uniquement • Taille max : 10MB
            </p>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Icons.Folder size={20} className="text-elysion-primary" />
              {selectedCategory === 'all' ? 'Tous les documents' : getCategoryLabel(selectedCategory)}
              <span className="text-sm font-normal text-gray-500">({filteredDocuments.length})</span>
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <Icons.Loading size={32} className="animate-spin mx-auto text-elysion-primary mb-4" />
              <p className="text-gray-600">Chargement des documents...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                <Icons.Folder size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2">Aucun document dans cette catégorie</p>
              <p className="text-sm text-gray-500">Uploadez votre premier document pour commencer</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icons.Document size={24} className="text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {editingDoc === doc.id ? (
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              value={newFilename}
                              onChange={(e) => setNewFilename(e.target.value)}
                              className="input-elysion flex-1"
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
                          <span>{new Date(doc.uploaded_at).toLocaleDateString('fr-FR')}</span>
                          <span>•</span>
                          <select
                            value={doc.category}
                            onChange={(e) => handleCategoryChange(doc.id, e.target.value)}
                            className="text-sm bg-transparent border-none cursor-pointer text-elysion-primary font-medium"
                          >
                            {categories.filter(c => c.value !== 'all').map(cat => (
                              <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => openPreview(doc.id)}
                        className="p-2 text-gray-600 hover:text-elysion-primary hover:bg-elysion-primary-50 rounded-lg transition-colors"
                        title="Prévisualiser"
                      >
                        <Icons.View size={20} />
                      </button>
                      <button
                        onClick={() => handleDownload(doc.id, doc.filename)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Télécharger"
                      >
                        <Icons.Download size={20} />
                      </button>
                      <button
                        onClick={() => startEditing(doc)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Renommer"
                      >
                        <Icons.Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Icons.Delete size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">Prévisualisation</h3>
              <button
                onClick={() => {
                  setPreviewDoc(null);
                  window.URL.revokeObjectURL(previewDoc);
                }}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icons.Close size={24} />
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