package com.inventory.scanner.repository;

import com.inventory.scanner.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {
    Item findByBarcode(String barcode);
}
