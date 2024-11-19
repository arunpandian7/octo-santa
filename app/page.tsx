"use client";

import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Gift, GripVertical, Edit2, Save, X } from "lucide-react";

// Define the type for wishlist items
interface WishlistItem {
  id: string;
  name: string;
  link?: string;
  price: string;
}

const SecretSantaWishlist: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [newItem, setNewItem] = useState<string>("");
  const [newItemLink, setNewItemLink] = useState<string>("");
  const [newItemPrice, setNewItemPrice] = useState<string>("");
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);

  const addWishlistItem = () => {
    if (newItem.trim() === "") return;

    const newWishlistItem: WishlistItem = {
      id: `item-${Date.now()}`,
      name: newItem,
      link: newItemLink || undefined,
      price: newItemPrice ? `$${parseFloat(newItemPrice).toFixed(2)}` : "N/A",
    };

    setWishlist([...wishlist, newWishlistItem]);
    resetInputs();
  };

  const resetInputs = () => {
    setNewItem("");
    setNewItemLink("");
    setNewItemPrice("");
    setEditingItem(null);
  };

  const removeWishlistItem = (id: string) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  const startEditItem = (item: WishlistItem) => {
    setEditingItem(item);
    setNewItem(item.name);
    setNewItemLink(item.link || "");
    setNewItemPrice(item.price !== "N/A" ? item.price.replace("$", "") : "");
  };

  const saveEditedItem = () => {
    if (!editingItem) return;

    const updatedWishlist = wishlist.map((item) =>
      item.id === editingItem.id
        ? {
            ...item,
            name: newItem,
            link: newItemLink || undefined,
            price: newItemPrice
              ? `$${parseFloat(newItemPrice).toFixed(2)}`
              : "N/A",
          }
        : item,
    );

    setWishlist(updatedWishlist);
    resetInputs();
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedWishlist = Array.from(wishlist);
    const [reorderedItem] = reorderedWishlist.splice(result.source.index, 1);
    reorderedWishlist.splice(result.destination.index, 0, reorderedItem);

    setWishlist(reorderedWishlist);
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Gift className="mr-2" /> WishWhisper
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Item Name"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <Input
            placeholder="Item Link (Optional)"
            value={newItemLink}
            onChange={(e) => setNewItemLink(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Price (Optional)"
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
            className="w-full"
          />
          {editingItem ? (
            <div className="flex space-x-2">
              <Button onClick={saveEditedItem} className="flex-grow">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={resetInputs}
                className="flex-grow"
              >
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={addWishlistItem} className="w-full">
              Add to Wishlist
            </Button>
          )}
        </div>

        {wishlist.length > 0 && (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="wishlist">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="mt-6 space-y-2"
                >
                  {wishlist.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex justify-between items-center p-3 bg-gray-100 rounded border"
                        >
                          <div {...provided.dragHandleProps} className="mr-2">
                            <GripVertical className="text-gray-500" />
                          </div>
                          <div className="flex-grow">
                            <div className="font-medium">
                              <span className="mr-2 text-gray-500">
                                #{index + 1}
                              </span>
                              {item.name}
                            </div>
                            {item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 text-sm"
                              >
                                View Link
                              </a>
                            )}
                            <div className="text-gray-500 text-sm">
                              {item.price}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => startEditItem(item)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => removeWishlistItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </CardContent>
      <CardFooter>
        <div className="text-center w-full text-gray-500">
          Drag to reorder, click edit to modify items
        </div>
      </CardFooter>
    </Card>
  );
};

export default SecretSantaWishlist;
