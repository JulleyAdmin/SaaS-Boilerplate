'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Download,
  Filter,
  Search,
  Calendar as CalendarIcon,
  Phone,
  Mail,
  Eye,
  Edit,
  UserPlus,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  IndianRupee,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react';

interface LeadTableViewProps {
  leads: any[];
  onView: (lead: any) => void;
  onEdit: (lead: any) => void;
  onStatusChange: (leadId: string, status: string) => void;
  onRefresh?: () => void;
  loading?: boolean;
}

const LeadTableView: React.FC<LeadTableViewProps> = ({
  leads,
  onView,
  onEdit,
  onStatusChange,
  onRefresh,
  loading = false,
}) => {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchTerm === '' || 
      `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    
    const matchesScore = scoreFilter === 'all' ||
      (scoreFilter === 'high' && lead.leadScore >= 80) ||
      (scoreFilter === 'medium' && lead.leadScore >= 60 && lead.leadScore < 80) ||
      (scoreFilter === 'low' && lead.leadScore < 60);
    
    const matchesDate = !dateRange.from || !dateRange.to ||
      (new Date(lead.createdAt) >= dateRange.from && new Date(lead.createdAt) <= dateRange.to);
    
    return matchesSearch && matchesStatus && matchesSource && matchesScore && matchesDate;
  });

  // Sort leads
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    let aVal = a[sortColumn];
    let bVal = b[sortColumn];
    
    if (sortColumn === 'name') {
      aVal = `${a.firstName} ${a.lastName}`;
      bVal = `${b.firstName} ${b.lastName}`;
    }
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedLeads.length / itemsPerPage);
  const paginatedLeads = sortedLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(paginatedLeads.map(lead => lead.leadId));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (leadId: string, checked: boolean) => {
    if (checked) {
      setSelectedLeads([...selectedLeads, leadId]);
    } else {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for leads:`, selectedLeads);
    // Implement bulk actions
    setSelectedLeads([]);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      inquiry: { color: 'bg-blue-500', icon: <AlertCircle className="w-3 h-3" /> },
      contacted: { color: 'bg-yellow-500', icon: <Phone className="w-3 h-3" /> },
      appointment_scheduled: { color: 'bg-purple-500', icon: <CalendarIcon className="w-3 h-3" /> },
      consultation_done: { color: 'bg-indigo-500', icon: <CheckCircle2 className="w-3 h-3" /> },
      admitted: { color: 'bg-green-500', icon: <CheckCircle2 className="w-3 h-3" /> },
      lost: { color: 'bg-red-500', icon: <XCircle className="w-3 h-3" /> },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { 
      color: 'bg-gray-500', 
      icon: <Clock className="w-3 h-3" /> 
    };

    return (
      <Badge className={`${config.color} text-white`}>
        <span className="flex items-center gap-1">
          {config.icon}
          {status.replace('_', ' ').toUpperCase()}
        </span>
      </Badge>
    );
  };

  const getScoreBadge = (score: number) => {
    const color = score >= 80 ? 'bg-green-100 text-green-800' :
                  score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  score >= 40 ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800';
    
    return <Badge className={color}>{score}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      {/* Filters and Actions Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, phone, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="inquiry">Inquiry</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="appointment_scheduled">Scheduled</SelectItem>
                  <SelectItem value="consultation_done">Consulted</SelectItem>
                  <SelectItem value="admitted">Admitted</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="google_search">Google Search</SelectItem>
                  <SelectItem value="patient_referral">Patient Referral</SelectItem>
                  <SelectItem value="doctor_referral">Doctor Referral</SelectItem>
                  <SelectItem value="walk_in">Walk-in</SelectItem>
                  <SelectItem value="practo">Practo/1mg</SelectItem>
                  <SelectItem value="facebook_ad">Facebook Ads</SelectItem>
                  <SelectItem value="corporate_tieup">Corporate</SelectItem>
                  <SelectItem value="health_camp">Health Camp</SelectItem>
                </SelectContent>
              </Select>

              <Select value={scoreFilter} onValueChange={setScoreFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="All Scores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scores</SelectItem>
                  <SelectItem value="high">High (80+)</SelectItem>
                  <SelectItem value="medium">Medium (60-79)</SelectItem>
                  <SelectItem value="low">Low (&lt;60)</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[130px]">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Date Range
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range: any) => setDateRange(range || { from: undefined, to: undefined })}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>

              <Button
                variant="outline"
                size="icon"
                onClick={onRefresh}
                disabled={loading}
              >
                <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              </Button>
            </div>

            {/* Bulk Actions */}
            {selectedLeads.length > 0 && (
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Bulk Actions ({selectedLeads.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleBulkAction('assign')}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Assign to User
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('email')}>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('whatsapp')}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send WhatsApp
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleBulkAction('export')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Export All */}
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Active Filters Display */}
          {(statusFilter !== 'all' || sourceFilter !== 'all' || scoreFilter !== 'all' || dateRange.from) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {statusFilter !== 'all' && (
                <Badge variant="secondary">
                  Status: {statusFilter.replace('_', ' ')}
                  <button
                    onClick={() => setStatusFilter('all')}
                    className="ml-2 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {sourceFilter !== 'all' && (
                <Badge variant="secondary">
                  Source: {sourceFilter.replace('_', ' ')}
                  <button
                    onClick={() => setSourceFilter('all')}
                    className="ml-2 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {scoreFilter !== 'all' && (
                <Badge variant="secondary">
                  Score: {scoreFilter}
                  <button
                    onClick={() => setScoreFilter('all')}
                    className="ml-2 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {dateRange.from && dateRange.to && (
                <Badge variant="secondary">
                  {format(dateRange.from, 'MMM dd')} - {format(dateRange.to, 'MMM dd')}
                  <button
                    onClick={() => setDateRange({ from: undefined, to: undefined })}
                    className="ml-2 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Patient Name
                    <SortIcon column="name" />
                  </div>
                </TableHead>
                <TableHead>Contact</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Status
                    <SortIcon column="status" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('source')}
                >
                  <div className="flex items-center gap-1">
                    Source
                    <SortIcon column="source" />
                  </div>
                </TableHead>
                <TableHead>Services</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('leadScore')}
                >
                  <div className="flex items-center gap-1">
                    Score
                    <SortIcon column="leadScore" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('estimatedRevenue')}
                >
                  <div className="flex items-center gap-1">
                    Est. Revenue
                    <SortIcon column="estimatedRevenue" />
                  </div>
                </TableHead>
                <TableHead>Insurance</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-1">
                    Created
                    <SortIcon column="createdAt" />
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                    No leads found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLeads.map((lead) => (
                  <TableRow key={lead.leadId} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedLeads.includes(lead.leadId)}
                        onCheckedChange={(checked) => handleSelectLead(lead.leadId, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {lead.firstName} {lead.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {lead.age || lead.ageRange} • {lead.gender}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3" />
                          {lead.phone}
                        </div>
                        {lead.email && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(lead.status)}
                      {lead.urgencyLevel === 'high' && (
                        <Badge className="bg-red-100 text-red-600 ml-1">
                          URGENT
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {lead.source?.replace('_', ' ')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        {lead.interestedServices?.slice(0, 2).map((service: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs mr-1 mb-1">
                            {service}
                          </Badge>
                        ))}
                        {lead.interestedServices?.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{lead.interestedServices.length - 2}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getScoreBadge(lead.leadScore || 0)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {formatCurrency(lead.estimatedRevenue || 0)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {lead.insuranceType?.includes('Corporate') ? (
                          <Badge variant="outline" className="text-xs">Corporate</Badge>
                        ) : lead.insuranceType?.includes('Ayushman') ? (
                          <Badge variant="outline" className="text-xs">PM-JAY</Badge>
                        ) : lead.insuranceType === 'Self-pay' ? (
                          <Badge variant="outline" className="text-xs">Self</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">Insurance</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView(lead)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(lead)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            WhatsApp
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            Schedule
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="text-sm text-gray-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, sortedLeads.length)} of{' '}
            {sortedLeads.length} leads
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = currentPage <= 3 ? i + 1 :
                               currentPage >= totalPages - 2 ? totalPages - 4 + i :
                               currentPage - 2 + i;
                if (pageNum < 1 || pageNum > totalPages) return null;
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LeadTableView;