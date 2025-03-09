"use client";

import { env } from "@/env";
import { useEffect, useState } from "react";
import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";

interface Props {
  baseUrl: string;
  totalPages: number;
  maxVisiblePages?: number | undefined;
  styles: {
    paginationRoot: string;
    paginationPrevious: string;
    paginationNext: string;
    paginationLink: string;
    paginationLinkActive: string;
  };
}

export const CustomPagination = ({
  baseUrl,
  totalPages,
  maxVisiblePages = 5,
  styles,
}: Props) => {
  const [currentPage, setPage] = useQueryState("page", {
    defaultValue: 1,
    parse: (value) => {
      const parsed = Number.parseInt(value, 10);
      return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
    },
    serialize: (value) => value.toString(),
    shallow: false,
  });

  const [visibleRange, setVisibleRange] = useState({
    start: 1,
    end: Math.min(maxVisiblePages, totalPages),
  });

  useEffect(() => {
    const halfVisible = Math.floor(maxVisiblePages / 2);
    const newStart = Math.max(
      1,
      Math.min(currentPage - halfVisible, totalPages - maxVisiblePages + 1)
    );

    const newEnd = Math.min(newStart + maxVisiblePages - 1, totalPages);
    setVisibleRange({ start: newStart, end: newEnd });
  }, [currentPage, totalPages, maxVisiblePages]);

  const createPageUrl = (pageNumber: number) => {
    const url = new URL(baseUrl, process.env.NEXT_PUBLIC_APP_URL);
    url.searchParams.set("page", pageNumber.toString());
    return url.toString();
  };

  const handleElipsisClick = (direction: "left" | "right") => {
    const newPage =
      direction === "left"
        ? Math.max(1, visibleRange.start - maxVisiblePages)
        : Math.min(totalPages, visibleRange.end + maxVisiblePages);

    setPage(newPage);
  };

  return (
    <PaginationRoot className={styles.paginationRoot}>
      <PaginationContent className="lg:gap-4 justify-end">
        <PaginationItem>
          <PaginationPrevious
            className={cn(
              currentPage <= 1 && "hidden",
              styles.paginationPrevious
            )}
            href={createPageUrl(currentPage - 1)}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) setPage(currentPage - 1);
            }}
          />
        </PaginationItem>

        {visibleRange.start > 1 && (
          <PaginationItem className="hidden lg:block">
            <PaginationLink
              className={styles.paginationLink}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleElipsisClick("left");
              }}
            >
              ...
            </PaginationLink>
          </PaginationItem>
        )}
        {Array.from(
          { length: visibleRange.end - visibleRange.start + 1 },
          (_, index) => visibleRange.start + index
        ).map((pageNumber) => {
          const isActive = pageNumber === currentPage;
          let rel = "";

          if (pageNumber === currentPage - 1) {
            rel = "prev";
          }
          if (pageNumber === currentPage + 1) {
            rel = "next";
          }
          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                {...(rel ? { rel } : {})}
                isActive={isActive}
                href={createPageUrl(pageNumber)}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(pageNumber);
                }}
                className={cn(
                  styles.paginationLink,
                  isActive && styles.paginationLinkActive
                )}
              >
                {pageNumber} {/* ADD THIS TO SHOW THE PAGE NUMBER */}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {visibleRange.end < totalPages && (
          <PaginationItem className="hidden lg:block">
            <PaginationLink
              className={styles.paginationLink}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleElipsisClick("right");
              }}
            >
              ...
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            className={cn(
              currentPage >= totalPages && "hidden",
              styles.paginationNext
            )}
            href={createPageUrl(currentPage + 1)}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) setPage(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
};
