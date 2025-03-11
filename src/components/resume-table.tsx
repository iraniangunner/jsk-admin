"use client";

import { useState } from "react";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import ReactPaginate from "react-paginate";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Eye,
  Loader2,
  TriangleAlert,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "lucide-react";
import { ResumeSearchParams, Resume } from "@/types/resume-types";
import { useResumes } from "@/hooks/useResume";

// Format date to a more readable format
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function ResumeTable() {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "created_at", desc: true },
  ]);
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [title, setTitle] = useState("");

  const searchParams: ResumeSearchParams = {
    page: page ? page : undefined,
    per_page: itemsPerPage ? itemsPerPage : undefined,
    title: title.length >= 2 ? title : undefined,
  };

  const { data, isLoading, isError } = useResumes(searchParams);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1);
  };

  const columns: ColumnDef<Resume>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center w-full"
          >
            <CaretSortIcon className="ml-2 h-4 w-4" />
            نام و نام خانوادگی
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return <div className="text-center">ایمیل</div>;
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "degree",
      header: ({ column }) => {
        return <div className="text-center">تحصیلات</div>;
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("degree")}</div>
      ),
    },

    {
      accessorKey: "major",
      header: ({ column }) => {
        return <div className="text-center">رشته تحصیلی</div>;
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("major")}</div>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center w-full"
          >
            <CaretSortIcon className="ml-2 h-4 w-4" />
            تاریخ ارسال
          </Button>
        );
      },
      cell: ({ row }) => {
        const created_at = row.getValue("created_at") as string;
        return <div className="text-center">{formatDate(created_at)}</div>;
      },
    },
    {
      id: "actions",
      header: ({ column }) => {
        return <div className="text-center">عملیات</div>;
      },
      cell: ({ row }) => {
        const resume = row.original;

        return (
          <div className="text-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">باز کردن منو</span>
                  <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => window.open(resume.full_path, "_blank")}
                >
                  <FileText className="ml-2 h-4 w-4" />
                  <span>مشاهده رزومه</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => window.open(`/resumes/${resume.id}`, "_blank")}
                >
                  <Eye className="ml-2 h-4 w-4" />
                  <span>مشاهده جزئیات</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data?.data || [],
    columns,
    onSortingChange: setSorting,
    // onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      // columnFilters,
    },
  });

  return (
    <div className="w-full" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle>مدیریت رزومه‌ها</CardTitle>
          <CardDescription>
            لیست رزومه‌های ارسال شده به سیستم. برای مرتب‌سازی بر اساس تاریخ ثبت،
            روی ستون تاریخ ثبت کلیک کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <Input
              placeholder="جستجو بر اساس نام..."
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="text-right">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24">
                      <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="mr-2">در حال بارگذاری...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableCell colSpan={columns.length} className="h-24">
                    <div className="flex justify-center items-center h-full">
                      <TriangleAlert className="h-6 w-6" />
                      <span className="mr-2">مشکلی رخ داده...</span>
                    </div>
                  </TableCell>
                ) : data?.data.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      هیچ نتیجه‌ای یافت نشد.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between sm:justify-end py-4">
            <ReactPaginate
              previousLabel={<ChevronRightIcon className="h-4 w-4" />}
              nextLabel={<ChevronLeftIcon className="h-4 w-4" />}
              breakLabel="..."
              pageCount={data?.meta.last_page || 1}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageChange}
              // forcePage={currentPage}
              containerClassName="flex items-center space-x-1 space-x-reverse"
              pageClassName="hidden sm:flex relative items-center"
              pageLinkClassName="h-8 w-8 flex items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              previousClassName="relative flex items-center"
              previousLinkClassName="h-8 w-8 flex items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              nextClassName="relative flex items-center"
              nextLinkClassName="h-8 w-8 flex items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              breakClassName="hidden sm:flex relative items-center"
              breakLinkClassName="hidden sm:flex h-8 w-8 flex items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              activeClassName="active"
              activeLinkClassName="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              disabledClassName="opacity-50 pointer-events-none"
            />

            <div className="sm:hidden text-sm text-center mt-2 self-start">
              صفحه {page} از
              {data?.meta.last_page || 1}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
