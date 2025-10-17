"use client";

import { useState } from "react";
import { TeamMember } from "@prisma/client";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Trash2,
  Search,
  Plus,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EditMemberDialog from "./EditMemberDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import content from "@/data/content.json";

interface TeamMembersTableProps {
  initialMembers: TeamMember[];
}

export default function TeamMembersTable({
  initialMembers,
}: TeamMembersTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter members based on search query
  const filteredMembers = initialMembers.filter(
    (member) =>
      member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.furigana.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

  // Reset to page 1 when search query changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setIsEditOpen(true);
  };

  const handleDelete = (member: TeamMember) => {
    setMemberToDelete(member);
    setIsDeleteOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditOpen(false);
    setSelectedMember(null);
    router.refresh();
  };

  const handleDeleteSuccess = () => {
    setIsDeleteOpen(false);
    setMemberToDelete(null);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {/* Header with search and add button */}
      <div className="flex gap-4 items-start sm:items-center justify-between">
        {/* Search input box */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
          <Input
            title="Search"
            placeholder="Search by name, nickname, or role..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-background placeholder:text-gray-400"
          />
        </div>
        {/* Add new member button */}
        <Button
          onClick={() => router.push("/register")}
          className="cursor-pointer"
        >
          <Plus className="size-4 mr-2" />
          Add New Member
        </Button>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-gray-600">
        <span>
          Total Members: <strong>{initialMembers.length}</strong>
        </span>
        {searchQuery && (
          <span>
            Filtered: <strong>{filteredMembers.length}</strong>
          </span>
        )}
        {filteredMembers.length > 0 && (
          <span>
            Showing:{" "}
            <strong>
              {startIndex + 1}-{Math.min(endIndex, filteredMembers.length)}
            </strong>{" "}
            of <strong>{filteredMembers.length}</strong>
          </span>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Nickname</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-[80px]">Age</TableHead>
              <TableHead>Part-time Job</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  {searchQuery
                    ? "No members found matching your search"
                    : "No team members yet"}
                </TableCell>
              </TableRow>
            ) : (
              paginatedMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Avatar className="size-10">
                      <AvatarImage src={member.image} alt={member.furigana} />
                      <AvatarFallback>
                        {member.furigana.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {member.firstName} {member.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.furigana}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{member.nickname}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>{member.role}</Badge>
                  </TableCell>
                  <TableCell>{member.age}</TableCell>
                  <TableCell className="text-gray-600">
                    {member.partTimeJob || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="icon"
                        title="View member"
                        className="cursor-pointer"
                        asChild
                      >
                        <Link
                          href={`/${member.id}`}
                          target="_blank"
                          className="cursor-pointer"
                        >
                          <Eye className="size-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(member)}
                        title="Edit member"
                        className="cursor-pointer"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(member)}
                        title="Delete member"
                        className="cursor-pointer hover:bg-destructive hover:text-gray-200"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <TooltipProvider>
          <div className="flex items-center justify-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{content.pages.first}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{content.pages.previous}</TooltipContent>
            </Tooltip>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                // Calculate page number to display
                let pageNumber;
                if (totalPages <= 10) {
                  // Show all pages if total is 10 or less
                  pageNumber = i + 1;
                } else {
                  // Show window of 10 pages around current page
                  const halfWindow = 5;
                  let startPage = Math.max(1, currentPage - halfWindow);
                  const endPage = Math.min(totalPages, startPage + 9);

                  // Adjust start if we're near the end
                  if (endPage - startPage < 9) {
                    startPage = endPage - 9;
                  }

                  pageNumber = startPage + i;
                }
                return pageNumber;
              }).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="size-8 aspect-square rounded-full cursor-pointer"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{content.pages.next}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{content.pages.last}</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      )}

      {/* Edit Dialog */}
      {selectedMember && (
        <EditMemberDialog
          member={selectedMember}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Dialog */}
      {memberToDelete && (
        <DeleteConfirmDialog
          member={memberToDelete}
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
