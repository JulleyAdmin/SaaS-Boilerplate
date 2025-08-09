'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Eye, 
  FileText, 
  Filter, 
  Folder, 
  Plus, 
  Search, 
  Upload,
  File,
  FileSpreadsheet,
  FileImage,
  Clock,
  Star,
  Share2,
  Trash2
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  category: string;
  uploadedBy: string;
  uploadedDate: string;
  lastModified: string;
  starred: boolean;
  shared: boolean;
}

const documentsData: Document[] = [
  {
    id: '1',
    name: 'Employee Handbook 2025.pdf',
    type: 'pdf',
    size: '2.4 MB',
    category: 'Policies',
    uploadedBy: 'HR Department',
    uploadedDate: '2025-01-15',
    lastModified: '2025-01-15',
    starred: true,
    shared: true
  },
  {
    id: '2',
    name: 'COVID-19 Safety Protocol.pdf',
    type: 'pdf',
    size: '1.8 MB',
    category: 'Health & Safety',
    uploadedBy: 'Medical Department',
    uploadedDate: '2025-07-01',
    lastModified: '2025-08-01',
    starred: true,
    shared: true
  },
  {
    id: '3',
    name: 'Monthly Report Template.xlsx',
    type: 'excel',
    size: '156 KB',
    category: 'Templates',
    uploadedBy: 'Admin',
    uploadedDate: '2025-06-15',
    lastModified: '2025-06-15',
    starred: false,
    shared: false
  },
  {
    id: '4',
    name: 'Training Certificate.jpg',
    type: 'image',
    size: '845 KB',
    category: 'Certificates',
    uploadedBy: 'Self',
    uploadedDate: '2025-07-20',
    lastModified: '2025-07-20',
    starred: false,
    shared: false
  },
  {
    id: '5',
    name: 'Leave Application Form.pdf',
    type: 'pdf',
    size: '234 KB',
    category: 'Forms',
    uploadedBy: 'HR Department',
    uploadedDate: '2025-03-10',
    lastModified: '2025-03-10',
    starred: false,
    shared: true
  },
  {
    id: '6',
    name: 'Fire Safety Training.pptx',
    type: 'presentation',
    size: '5.6 MB',
    category: 'Training',
    uploadedBy: 'Safety Officer',
    uploadedDate: '2025-07-28',
    lastModified: '2025-07-28',
    starred: false,
    shared: true
  }
];

const categories = [
  'All Documents',
  'Policies',
  'Health & Safety',
  'Templates',
  'Certificates',
  'Forms',
  'Training',
  'Reports',
  'Personal'
];

export default function DocumentsPage() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>(documentsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Documents');
  const [view, setView] = useState<'grid' | 'list'>('list');

  const handleDownload = (doc: Document) => {
    toast({
      title: "Download Started",
      description: `Downloading ${doc.name}...`,
    });
  };

  const handleView = (doc: Document) => {
    toast({
      title: "Opening Document",
      description: `Opening ${doc.name} in viewer...`,
    });
  };

  const handleUpload = () => {
    toast({
      title: "Upload Document",
      description: "File upload dialog would open here",
    });
  };

  const handleToggleStar = (docId: string) => {
    setDocuments(prevDocs =>
      prevDocs.map(doc =>
        doc.id === docId ? { ...doc, starred: !doc.starred } : doc
      )
    );
  };

  const handleShare = (doc: Document) => {
    toast({
      title: "Share Document",
      description: `Sharing options for ${doc.name}`,
    });
  };

  const handleDelete = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    setDocuments(documents.filter(d => d.id !== docId));
    toast({
      title: "Document Deleted",
      description: `${doc?.name} has been removed`,
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="size-5 text-red-500" />;
      case 'excel':
        return <FileSpreadsheet className="size-5 text-green-500" />;
      case 'image':
        return <FileImage className="size-5 text-blue-500" />;
      default:
        return <File className="size-5 text-gray-500" />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Documents' || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: documents.length,
    shared: documents.filter(d => d.shared).length,
    starred: documents.filter(d => d.starred).length,
    recent: documents.filter(d => {
      const uploadDate = new Date(d.uploadedDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return uploadDate > weekAgo;
    }).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Access and manage your documents and forms</p>
        </div>
        <Button onClick={handleUpload}>
          <Upload className="mr-2 size-4" />
          Upload Document
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Available files</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shared</CardTitle>
            <Share2 className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.shared}</div>
            <p className="text-xs text-muted-foreground">Shared with you</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Starred</CardTitle>
            <Star className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.starred}</div>
            <p className="text-xs text-muted-foreground">Important docs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent</CardTitle>
            <Clock className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recent}</div>
            <p className="text-xs text-muted-foreground">Added this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="starred">Starred</TabsTrigger>
          <TabsTrigger value="shared">Shared with Me</TabsTrigger>
          <TabsTrigger value="my-uploads">My Uploads</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Document Library</CardTitle>
              <CardDescription>All available documents and forms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredDocuments.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(doc.type)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{doc.name}</p>
                          {doc.starred && <Star className="size-4 text-yellow-500 fill-yellow-500" />}
                          {doc.shared && <Share2 className="size-4 text-blue-500" />}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {doc.size} • {doc.category} • Uploaded by {doc.uploadedBy} on {doc.uploadedDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleToggleStar(doc.id)}
                      >
                        <Star className={`size-4 ${doc.starred ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleView(doc)}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download className="size-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleShare(doc)}
                      >
                        <Share2 className="size-4" />
                      </Button>
                      {doc.uploadedBy === 'Self' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {filteredDocuments.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No documents found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="starred">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {documents.filter(d => d.starred).map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(doc.type)}
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">{doc.category} • {doc.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleView(doc)}>
                        <Eye className="size-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(doc)}>
                        <Download className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shared">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {documents.filter(d => d.shared).map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(doc.type)}
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Shared by {doc.uploadedBy} • {doc.category}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Shared</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-uploads">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {documents.filter(d => d.uploadedBy === 'Self').map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(doc.type)}
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Uploaded on {doc.uploadedDate} • {doc.size}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
          <CardDescription>Frequently used documents and forms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Button variant="outline" className="justify-start" onClick={() => handleView(documentsData[0])}>
              <FileText className="mr-2 size-4 text-red-500" />
              Employee Handbook
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => handleView(documentsData[4])}>
              <FileText className="mr-2 size-4 text-red-500" />
              Leave Application
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => handleView(documentsData[1])}>
              <FileText className="mr-2 size-4 text-red-500" />
              Safety Protocol
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}