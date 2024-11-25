;; genomic-marketplace.clar

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-exists (err u102))

;; Data vars
(define-data-var next-user-id uint u0)
(define-data-var next-dataset-id uint u0)

;; Maps
(define-map Users uint
  {
    address: principal,
    reputation: uint
  }
)

(define-map UserAddresses principal uint)

(define-map Datasets uint
  {
    owner: uint,
    price: uint,
    description: (string-ascii 256),
    ipfs-hash: (string-ascii 64)
  }
)

;; Public functions
(define-public (register-user)
  (let
    (
      (user-id (var-get next-user-id))
    )
    (asserts! (is-none (map-get? UserAddresses tx-sender)) err-already-exists)
    (map-set Users user-id { address: tx-sender, reputation: u0 })
    (map-set UserAddresses tx-sender user-id)
    (var-set next-user-id (+ user-id u1))
    (ok user-id)
  )
)

(define-public (add-dataset (price uint) (description (string-ascii 256)) (ipfs-hash (string-ascii 64)))
  (let
    (
      (dataset-id (var-get next-dataset-id))
      (user-id (get-user-id tx-sender))
    )
    (asserts! (is-some user-id) err-not-found)
    (map-insert Datasets dataset-id
      {
        owner: (unwrap-panic user-id),
        price: price,
        description: description,
        ipfs-hash: ipfs-hash
      }
    )
    (var-set next-dataset-id (+ dataset-id u1))
    (ok dataset-id)
  )
)

(define-read-only (get-dataset (dataset-id uint))
  (map-get? Datasets dataset-id)
)

(define-read-only (get-user (user-id uint))
  (map-get? Users user-id)
)

(define-read-only (get-user-id (address principal))
  (map-get? UserAddresses address)
)

;; Private functions
(define-private (is-contract-owner)
  (is-eq tx-sender contract-owner)
)

