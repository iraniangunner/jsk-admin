"use client";

import { useState } from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Loader2, TriangleAlert, Edit, Plus } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  deleteTenderCategory,
  getTenderCategories,
} from "@/hooks/use-tenderCategory";
import { TenderCategory } from "@/types/tenderCategory-types";

const formatDate = (dateString: any) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR");
  } catch (e) {
    return dateString;
  }
};

export function TenderCategoryTable() {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "created_at", desc: true },
  ]);

  const { data, isLoading, isError } = getTenderCategories();

  const columns: ColumnDef<TenderCategory>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return <div className="text-center">شماره</div>;
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("id")}</div>
      ),
    },

    {
      accessorKey: "title",
      header: ({ column }) => {
        return <div className="text-center">متن فارسی</div>;
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("title")}</div>
      ),
    },

    {
      accessorKey: "title_en",
      header: ({ column }) => {
        return <div className="text-center">متن انگلیسی</div>;
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("title_en")}</div>
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
            تاریخ ایجاد
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
        const tenderCategory = row.original;
        const [showDeleteDialog, setShowDeleteDialog] = useState(false);

        const { mutate: deleteTenderCategorytById, isPending: isDeleting } =
          deleteTenderCategory();

        const handleDelete = () => {
          deleteTenderCategorytById(tenderCategory.id, {
            onSuccess: () => {
              toast.success("آیتم مورد نظر حذف شد");
              setShowDeleteDialog(false);
            },
            onError: (error: any) => {
              toast.error("مشکلی پیش آمده دوباره تلاش کنید");
            },
          });
        };
        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer"
              title="ویرایش دسته بندی"
            >
              <Link
                href={`/tender-categories/${tenderCategory.id}/edit`}
                className="w-full h-full flex justify-center items-center"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">ویرایش دسته بندی</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive hover:bg-destructive/10 cursor-pointer"
              title="حذف دسته بندی"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">حذف دسته بندی</span>
            </Button>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogContent>
                <DialogHeader>
                  <VisuallyHidden>
                    <DialogTitle>Hidden Dialog Title</DialogTitle>
                  </VisuallyHidden>
                  <DialogDescription className="sm:text-lg">
                    آیا از حذف این دسته بندی اطمینان دارید؟
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-row gap-2 justify-center">
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => setShowDeleteDialog(false)}
                    disabled={isDeleting}
                  >
                    خیر
                  </Button>
                  <Button
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        در حال حذف...
                      </>
                    ) : (
                      "حذف"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data || [],
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
    <>
      <ToastContainer />
      <div className="w-full" dir="rtl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>مدیریت دسته بندی مناقصات</CardTitle>
              <CardDescription className="mt-2">
                لیست دسته بندی های مناقصات
              </CardDescription>
            </div>
            <Link href="/project-categories/create">
              <Button className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                افزودن دسته بندی جدید
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} className="text-center">
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
                  ) : data?.length ? (
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
          </CardContent>
        </Card>
      </div>
    </>
  );
}
