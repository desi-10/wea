"use client";

import type { Contact } from "@/app/dashboard/page.tsx";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ContactTableProps {
  contacts: Contact[];
  selectedContacts: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: (checked: boolean) => void;
}

export function ContactTable({
  contacts,
  selectedContacts,
  onToggleSelect,
  onToggleSelectAll,
}: ContactTableProps) {
  const allSelected =
    contacts.length > 0 && contacts.every((c) => selectedContacts.has(c.id));
  const someSelected =
    contacts.some((c) => selectedContacts.has(c.id)) && !allSelected;

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[50px] px-4">
              <Checkbox
                checked={
                  allSelected ? true : someSelected ? "indeterminate" : false
                }
                onCheckedChange={(checked) => onToggleSelectAll(!!checked)}
              />
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Name
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Phone
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Address
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-32 text-center text-muted-foreground"
              >
                No contacts found. Add some to get started.
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow
                key={contact.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="px-4">
                  <Checkbox
                    checked={selectedContacts.has(contact.id)}
                    onCheckedChange={() => onToggleSelect(contact.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-sm">
                  {contact.phone}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {contact.address}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
