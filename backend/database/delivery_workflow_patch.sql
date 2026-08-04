-- Apply after importing rowater.sql (or run `php spark migrate`).
-- Supports jar + water deliveries and associates a delivery with a party order.
ALTER TABLE deliveries
  MODIFY COLUMN customer_id INT NULL,
  ADD COLUMN party_order_id INT NULL AFTER customer_id,
  ADD COLUMN delivered_water_liters DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER delivered_jars,
  ADD INDEX idx_delivery_party_order (party_order_id);
