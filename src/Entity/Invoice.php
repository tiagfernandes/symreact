<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Controller\InvoiceIncrementationController;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ApiResource(
 *      itemOperations={
 *          "get",
 *          "put",
 *          "delete",
 *          "post_invoice"={
 *              "method"="POST",
 *              "path"="/invoices/{id}/increment",
 *              "controller"=InvoiceIncrementationController::class,
 *              "swagger_context"={
 *                  "summary"="Incrémente une facture",
 *                  "description"="Incrémente une donnée",
 *              }
 *          }
 *      },
 *      attributes={
 *          "pagination_enabled"=false,
 *          "order": {"sentAt":"desc"}
 *      },
 *      normalizationContext={"groups":{"invoices_read"}},
 *      subresourceOperations={
 *          "api_customers_invoices_get_subresource"={
 *               "normalization_context"={"groups"={"invoices_subresource"}}
 *          }
 *     },
 *     denormalizationContext={"disable_type_enforcement"=true},
 * )
 * @ApiFilter(OrderFilter::class, properties={"amout","sentAt"})
 * @ORM\Entity(repositoryClass="App\Repository\InvoiceRepository")
 */
class Invoice
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\NotBlank()
     * @Assert\Type(type="numeric")
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\NotBlank()
     */
    private $sentAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\NotBlank()
     * @Assert\Choice(choices={"SENT", "PAID", "CANCELLED"})
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoices_read"})
     * @Assert\NotBlank()
     */
    private $customer;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\NotBlank()
     * @Assert\Type(type="integer")
     */
    private $chrono;

    public function __construct()
    {
        $this->setSentAt(new \DateTime());
    }

    /**
     * Retourn le User de la facture
     * @Groups({"invoices_read", "invoices_subresource"})
     * @return User
     */
    public function getUser(): User
    {
        return $this->getCustomer()->getUser();
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt()
    {
        return $this->sentAt;
    }

    public function setSentAt($sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
