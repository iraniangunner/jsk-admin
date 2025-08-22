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
import { deleteProject, getProjects } from "@/hooks/use-project";
import { Project, ProjectSearchParams } from "@/types/project-types";
import { getCategories } from "@/hooks/use-category";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const formatDate = (dateString: any) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR");
  } catch (e) {
    return dateString;
  }
};

interface Image {
  full_path: string;
}

export function ProjectTable() {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "created_at", desc: true },
  ]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // const [title, setTitle] = useState("");
  // const [appliedTitle, setAppliedTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [forcePage, setForcePage] = useState<number | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const searchParams: ProjectSearchParams = {
    page: page ? page : undefined,
    per_page: itemsPerPage ? itemsPerPage : undefined,
    category_id: categoryId ? categoryId : undefined,
  };

  const { data, isLoading, isError } = getProjects(searchParams);
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoryError,
  } = getCategories();

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1);
    setForcePage(undefined);
  };

  const columns: ColumnDef<Project>[] = [
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
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center w-full"
          >
            <CaretSortIcon className="ml-2 h-4 w-4" />
            نام پروژه
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("title")}</div>
      ),
    },

    {
      accessorKey: "images",
      header: () => <div className="text-center">تصویر</div>,
      cell: ({ row }) => {
        const images = row.getValue("images") as Image[];
        return (
          <div className="flex justify-center items-center">
            <div className="relative h-10 w-16 overflow-hidden rounded">
              <img
                src={images[0].full_path || "/placeholder.svg"}
                alt="تصویر پروژه"
                className="object-cover"
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "employer",
      header: ({ column }) => {
        return <div className="text-center">کارفرما</div>;
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("employer")}</div>
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
      accessorKey: "location",
      header: ({ column }) => {
        return <div className="text-center">محل پروژه</div>;
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("location")}</div>
      ),
    },
    {
      id: "actions",
      header: ({ column }) => {
        return <div className="text-center">عملیات</div>;
      },
      cell: ({ row }) => {
        const project = row.original;
        const [showDeleteDialog, setShowDeleteDialog] = useState(false);

        const { mutate: deleteProjectById, isPending: isDeleting } =
          deleteProject();

        const handleDelete = () => {
          deleteProjectById(project.id, {
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
              title="ویرایش پروژه"
            >
              <Link
                href={`/projects/${project.id}/edit`}
                className="w-full h-full flex justify-center items-center"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">ویرایش پروژه</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive hover:bg-destructive/10 cursor-pointer"
              title="حذف پروژه"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">حذف پروژه</span>
            </Button>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogContent>
                <DialogHeader>
                <VisuallyHidden>
                    <DialogTitle>Hidden Dialog Title</DialogTitle>
                  </VisuallyHidden>
                  <DialogDescription className="sm:text-lg">
                    آیا از حذف این پروژه اطمینان دارید؟
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

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    setPage(1);
    setForcePage(0);
  };
  // const applyFilters = () => {
  //   if (title && title.length < 2) {
  //     setErrorMessage("باید حداقل شامل ۲ حرف باشد.");
  //     return;
  //   }
  //   setErrorMessage("");
  //   setAppliedTitle(title);
  //   setPage(1);
  //   setForcePage(0);
  // };

  // const clearFilters = () => {
  //   setErrorMessage("");
  //   setTitle("");
  //   setAppliedTitle("");
  //   setPage(1);
  //   setForcePage(0);
  // };

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
              <CardTitle>مدیریت پروژه ها</CardTitle>
              <CardDescription>
                لیست پروژه های شرکت، برای مرتب‌سازی بر اساس تاریخ
                ثبت، روی ستون تاریخ ثبت کلیک کنید.
              </CardDescription>
            </div>
            <Link href="/projects/create">
              <Button className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                افزودن پروژه جدید
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="py-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="w-full max-w-sm">
                  <Select
                    value={categoryId}
                    onValueChange={handleCategoryChange}
                    disabled={categoriesLoading}
                    dir="rtl"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="جستجو بر اساس نوع دسته بندی" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* <SelectItem value="all">همه دسته بندی ها</SelectItem> */}
                      {categories?.map((category: any) => (
                        <SelectItem
                          key={category.id}
                          value={String(category.id)}
                        >
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
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
                pageCount={data?.last_page || 1}
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
                {data?.last_page || 1}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
