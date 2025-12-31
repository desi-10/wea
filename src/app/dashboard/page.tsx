"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PlusIcon, LogOutIcon, TrashIcon } from "lucide-react";
import { normalizePhone, sanitizePhone, sanitizeText } from "@/lib/normalize";
import { SendSMSDialog } from "../components/sms-dialog";

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export default function DashboardPage() {
  const [isSending, setIsSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isSmsDialogOpen, setIsSmsDialogOpen] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(
    new Set()
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const currentUser =
    typeof window !== "undefined"
      ? localStorage.getItem("currentUser") || ""
      : "";
  const router = useRouter();

  // Form state for adding new contact
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("/api/contacts");
        const data = await res.json();
        setContacts(data);
      } catch (error) {
        toast.error("Failed to load contacts");
      }
    };

    fetchContacts();
  }, []);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSending(true);
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to create contact");
      }

      const newContact = await res.json();

      setContacts((prev) => [newContact, ...prev]);
      setFormData({ name: "", phone: "", email: "", address: "" });
      setIsDialogOpen(false);

      toast.success("Contact added");
    } catch (error) {
      toast.error("Could not add contact");
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    await fetch("/api/contacts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setContacts((prev) => prev.filter((c) => c.id !== id));
    toast.success("Contact deleted");
  };

  const handleSelectAll = () => {
    const allIds = new Set(contacts.map((c) => c.id));
    setSelectedContacts(allIds);
    toast("All contacts selected", {
      description: `${contacts.length} contacts selected.`,
    });
  };

  const handleDeselectAll = () => {
    setSelectedContacts(new Set());
    toast("All contacts deselected", {
      description: "Selection cleared.",
    });
  };

  const handleToggleContact = (id: string) => {
    const newSelection = new Set(selectedContacts);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedContacts(newSelection);
  };

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    window.location.reload();
  };

  const handleSendBulkSMS = async (message: string) => {
    if (selectedContacts.size === 0) {
      toast.error("No contacts selected");
      return;
    }

    // const message = prompt("Enter SMS message");

    // if (!message) return;

    const selectedContactsList = contacts.filter((c) =>
      selectedContacts.has(c.id)
    );

    const phoneNumbers = selectedContactsList.map((c) =>
      normalizePhone(c.phone)
    );

    setIsSending(true);

    try {
      const res = await fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          phoneNumbers,
        }),
      });

      if (!res.ok) throw new Error();
      setIsDialogOpen(false);
      toast.success(`SMS sent to ${phoneNumbers.length} contact(s)`);
    } catch (error) {
      toast.error("Failed to send SMS");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Send Bulk SMS
              </h1>
              <p className="text-sm text-muted-foreground">{currentUser}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOutIcon className="size-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <section>
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="">
                <CardTitle>Your Contacts</CardTitle>
                <CardDescription>
                  Manage your contacts and send bulk SMS messages
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusIcon className="size-4" />
                    Add Contact
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleAddContact}>
                    <DialogHeader>
                      <DialogTitle>Add New Contact</DialogTitle>
                      <DialogDescription>
                        Enter the contact details below
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              name: sanitizeText(e.target.value, 80),
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              phone: sanitizePhone(e.target.value),
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <textarea
                          id="address"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: sanitizeText(e.target.value, 200),
                            })
                          }
                          className="w-full border rounded-md focus:ring-4 focus:ring-gray-300 transition p-2.5"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        {isSending ? (
                          <span className="animate-spin">⏳</span>
                        ) : (
                          <p>Add Contact</p>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div>
            {contacts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No contacts yet</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <PlusIcon className="size-4" />
                  Add Your First Contact
                </Button>
              </div>
            ) : (
              <>
                {/* Bulk Actions */}
                <div className="flex items-center gap-2 mb-4">
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeselectAll}
                  >
                    Deselect All
                  </Button>
                  <div className="flex-1" />
                  <SendSMSDialog
                    handleSendBulkSMS={handleSendBulkSMS}
                    selectedContacts={selectedContacts}
                    isSmsDialogOpen={isSmsDialogOpen}
                    setIsSmsDialogOpen={setIsSmsDialogOpen}
                    isSending={isSending}
                  />
                </div>

                {/* Contacts Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <span className="sr-only">Select</span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead className="w-12">
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedContacts.has(contact.id)}
                              onCheckedChange={() =>
                                handleToggleContact(contact.id)
                              }
                              aria-label={`Select ${contact.name}`}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {contact.name}
                          </TableCell>
                          <TableCell>{contact.phone}</TableCell>
                          <TableCell>{contact.email || "-"}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {contact.address || "-"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              disabled={isDeleting === contact.id}
                              onClick={async () => {
                                setIsDeleting(contact.id);
                                await handleDeleteContact(contact.id);
                                setIsDeleting(null);
                              }}
                            >
                              {isDeleting === contact.id ? (
                                <span className="animate-spin">⏳</span>
                              ) : (
                                <TrashIcon className="size-4 text-destructive" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
