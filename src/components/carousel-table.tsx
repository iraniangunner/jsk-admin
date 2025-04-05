"use client";
import { useState, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Trash2,
  Loader2,
  TriangleAlert,
  ChevronRightIcon,
  ChevronLeftIcon,
  Edit,
  Plus,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { deleteSlide, getSlides } from "@/hooks/use-carousel";
import { Slide } from "@/types/carousel-types";

const formatDate = (dateString: any) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR");
  } catch (e) {
    return dateString;
  }
};

export function CarouselTable() {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "created_at",desc:true},
  ]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [forcePage, setForcePage] = useState<number | undefined>(undefined);

  const { data, isLoading, isError } = getSlides();

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1);
    setForcePage(undefined);
  };

  const columns: ColumnDef<Slide>[] = [
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
      accessorKey: "text",
      header: ({ column }) => {
        return <div className="text-center">متن فارسی</div>;
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("text")}</div>
      ),
    },

    {
      accessorKey: "full_path",
      header: () => <div className="text-center">تصویر</div>,
      cell: ({ row }) => {
        const image = row.getValue("full_path") as string;
        return (
          <div className="flex justify-center items-center">
            <div className="relative h-10 w-16 overflow-hidden rounded">
              <img
                src={image || "/placeholder.svg"}
                alt="تصویر اسلاید"
                className="object-cover"
              />
            </div>
          </div>
        );
      },
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
        const slide = row.original;
        const [showDeleteDialog, setShowDeleteDialog] = useState(false);

        const { mutate: deleteSlideById, isPending: isDeleting } =
          deleteSlide();

        const handleDelete = () => {
          deleteSlideById(slide.id, {
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
              title="ویرایش اسلاید"
            >
              <Link
                href={`/slides/${slide.id}/edit`}
                className="w-full h-full flex justify-center items-center"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">ویرایش اسلاید</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive hover:bg-destructive/10 cursor-pointer"
              title="حذف اسلاید"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">حذف اسلاید</span>
            </Button>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogDescription className="sm:text-lg">
                    آیا از حذف این اسلاید اطمینان دارید؟
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

  useEffect(() => {
    if (forcePage !== undefined) {
      setForcePage(undefined);
    }
  }, [forcePage]);

  return (
    <>
      <ToastContainer />
      <div className="w-full" dir="rtl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>مدیریت اسلایدها</CardTitle>
              <CardDescription className="mt-2">
                لیست اسلایدهای کاروسل. برای مرتب‌سازی بر اساس تاریخ ایجاد، روی
                ستون تاریخ ایجاد کلیک کنید.
              </CardDescription>
            </div>
            <Link href="/slides/create">
              <Button className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                افزودن اسلاید جدید
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
            <div className="flex items-center justify-between sm:justify-end py-4">
              <ReactPaginate
                previousLabel={<ChevronRightIcon className="h-4 w-4" />}
                nextLabel={<ChevronLeftIcon className="h-4 w-4" />}
                breakLabel="..."
                // pageCount={data?.meta.last_page || 1}
                pageCount={1}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageChange}
                forcePage={forcePage}
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
                {/* {data?.meta.last_page || 1} */}
                {1}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
