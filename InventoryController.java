package com.inventory.scanner.controller;

import com.inventory.scanner.model.Item;
import com.inventory.scanner.repository.ItemRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class InventoryController {
    private final ItemRepository itemRepository;

    public InventoryController(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    @GetMapping
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    @PostMapping
    public Item addItem(@RequestBody Item item) {
        Item existing = itemRepository.findByBarcode(item.getBarcode());
        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + 1);
            return itemRepository.save(existing);
        }
        item.setQuantity(1);
        return itemRepository.save(item);
    }

    @DeleteMapping("/{barcode}")
    public void removeItem(@PathVariable String barcode) {
        itemRepository.deleteByBarcode(barcode);
    }
}
