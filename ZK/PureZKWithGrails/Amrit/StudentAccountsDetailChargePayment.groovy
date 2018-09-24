package amrit

import org.hibernate.annotations.Type
import javax.persistence.*

/**
 * Detail Charge/Payment Code Definition Table
 * This domain was created as read only for lookups on student pages
 */
@Entity
@Table(name = "TBBDETC")

class StudentAccountsDetailChargePayment implements Serializable {

    /**
     * Surrogate ID for TBBDETC
     */
    @Id
    @Column(name = "TBBDETC_SURROGATE_ID")
    @SequenceGenerator(name = "TBBDETC_SEQ_GEN", allocationSize = 1, sequenceName = "TBBDETC_SURROGATE_ID_SEQUENCE")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "TBBDETC_SEQ_GEN")
    Long id

    /**
     * This field identifies the detail code associated with every charge and payment that can be entered onto an account.
     */
    @Column(name = "TBBDETC_DETAIL_CODE")
    String code

    /**
     * This field specifies a free-format description of the detail code.
     */
    @Column(name = "TBBDETC_DESC")
    String description

    /**
     * This field indicates the whether the detail code is a charge or a payment.  Valid values are: C - Charge, P - Payment.
     */
    @Column(name = "TBBDETC_TYPE_IND")
    String typeIndicator

    /**
     * This field indicates the priority of the detail code for use in the application of payments process.
     */
    @Column(name = "TBBDETC_PRIORITY")
    String priority

    /**
     * This field indicates if a detail code can only be applied to a detail code in the same term in the application of payment process.  Valid value is: Y - Yes, only apply to a like term.  Used primarily for financial aid.
     */
    @Column(name = "TBBDETC_LIKE_TERM_IND")
    String likeTermIndicator

    /**
     * This field specifies the default amount associated with the detail code.
     */
    @Column(name = "TBBDETC_AMOUNT")
    BigDecimal amount

    /**
     * This field specifies the default effective date associated with the detail code.
     */
    @Column(name = "TBBDETC_EFFECTIVE_DATE")
    Date effectiveDate

    /**
     * Refundable Indicator: Y to include credit amount in refund process (TFRRFND/TSRRFND) and to include in Location Management refund calculations; null if not selected.
     */
    @Column(name = "TBBDETC_REFUNDABLE_IND")
    String refundableIndicator

    /**
     * This field indicates if a receipt number should be automatically generated when the detail code is entered on an account.  Valid values are: Y - Yes, generate a receipt, blank - No receipt number.
     */
    @Column(name = "TBBDETC_RECEIPT_IND")
    String receiptIndicator

    /**
     * This field indicates if the detail code is identified as refund detail code that will generate an accounts payable transaction in the accounting feed.  Valid values are: Y - Generate accounts payable transaction, blank - Do not.
     */
    @Column(name = "TBBDETC_REFUND_IND")
    String refundIndicator

    /**
     * This field specifies the most current date record was created or updated.
     */
    @Column(name = "TBBDETC_ACTIVITY_DATE")
    @Temporal(TemporalType.TIMESTAMP)
    Date lastModified

    /**
     * Should this detail code be printed on a student invoice.  Valid values are: N (Do not print) or blank.
     */
    @Column(name = "TBBDETC_PREBILL_PRINT_IND")
    String prebillPrintIndicator

    /**
     * Indicates whether a detail code is associated with a term-based designator (Y/N).
     */

    @Column(name = "TBBDETC_TBDC_IND")
    String termBasedIndicator

    /**
     * DETAIL CODE INDICATOR: This column defines a detail code indicator. Valid values are : (B)ill, (P)ayment, (T)ransfer, (R)efund, Null.
     */
    @Column(name = "TBBDETC_DETAIL_CODE_IND")
    String detailCodeIndicator

    /**
     * Can accounting distribution information be overridden for miscellaneous transactions on the TFAMISC form.  Values are Y and N.
     */
    @Type(type = "yes_no")
    @Column(name = "TBBDETC_GL_NOS_ENTERABLE")
    Boolean glNosEnterable

    /**
     * DETC_ACTIVE_IND: Active Status Indicator of the Detail Code.
     */
    @Type(type = "yes_no")
    @Column(name = "TBBDETC_DETC_ACTIVE_IND")
    Boolean detailActiveIndicator

    /**
     * DIRECT DEPOSIT REFUND INDICATOR: Indicator used to determine whether refund code is to be processed through direct deposit payment, (Y)es and (N)o.
     */
    @Type(type = "yes_no")
    @Column(name = "TBBDETC_DIRD_IND")
    Boolean directDepositRefundIndicator

    /**
     * TITLE IV INDICATOR: This field indicates if the detail code is identified as Title IV detail code. Valid value is: (Y)es, Title IV detail code, and (N)o.  This is used primarily by the application of payment process and Refund Process.
     */
    @Type(type = "yes_no")
    @Column(name = "TBBDETC_TIV_IND")
    Boolean tivIndicator

    /**
     * INSTITUTION CHARGE INDICATOR: This field indicates if the detail code is identified as Institutional Charges detail code. Valid value is: (Y)es, Institutional charge detail code, and (N)o. This is used by the application of payment process.
     */
    @Type(type = "yes_no")
    @Column(name = "TBBDETC_INST_CHG_IND")
    Boolean institutionChgIndicator

    /**
     * AID YEAR INDICATOR: This field indicates if a detail code can only be applied to a transaction in the same aid year.  Valid values: (Y)es, apply only to a like aid year, and (N)o; Used primarily for financial aid transactions.
     */
    @Type(type = "yes_no")
    @Column(name = "TBBDETC_LIKE_AIDY_IND")
    Boolean likeAidYearIndicator

    /**
     * Display transactions with this detail code in Payment History (Y = display, N = do not display).
     */
    @Type(type = "yes_no")
    @Column(name = "TBBDETC_PAYHIST_IND")
    Boolean payhistIndicator

    /**
     * Version column which is used as a optimistic lock token for TBBDETC
     */
    @Version
    @Column(name = "TBBDETC_VERSION")
    Long version

    /**
     * Last Modified By column for TBBDETC
     */
    @Column(name = "TBBDETC_USER_ID")
    String lastModifiedBy

    /**
     * Data Origin column for TBBDETC
     */
    @Column(name = "TBBDETC_DATA_ORIGIN")
    String dataOrigin

    /**
     * Foreign Key : FK1_TBBDETC_INV_STVTERM_CODE
     */
    @ManyToOne
    @JoinColumns([
    @JoinColumn(name = "TBBDETC_TERM_CODE", referencedColumnName = "STVTERM_CODE")
    ])
    Term term

    /**
     * Foreign Key : FK1_TBBDETC_INV_TTVDCAT_CODE
     */
    @ManyToOne
    @JoinColumns([
    @JoinColumn(name = "TBBDETC_DCAT_CODE", referencedColumnName = "TTVDCAT_CODE")
    ])
    DetailChargePaymentCategory detailCategory

    // TODO add the domain mappings for the next two fields when the form is added for data entry
    /**
     * Foreign Key : FK1_TBBDETC_INV_TTVPAYT_CODE
     */
    /*@ManyToOne
     @JoinColumns([
         @JoinColumn(name="TBBDETC_PAYT_CODE", referencedColumnName="TTVPAYT_CODE")
         ])
     TTVPAYT payt*/

    @Column(name = "TBBDETC_PAYT_CODE")
    String paymentType
    /**
     * Foreign Key : FK1_TBBDETC_INV_TTVTAXT_CODE
     */
    /*@ManyToOne
     @JoinColumns([
         @JoinColumn(name="TBBDETC_TAXT_CODE", referencedColumnName="TTVTAXT_CODE")
         ])
     TTVTAXT taxt*/

    @Column(name = "TBBDETC_TAXT_CODE")
    String taxType

    /**
     * AID YEAR BASED INDICATOR: Indicates whether a detail code is associated with an aid year-based designator (Y/N).
     */
    @Type(type = "yes_no")
    @Column(name = "TBBDETC_ABDC_IND")
    Boolean aidYearBasedIndicator = false



    /*PROTECTED REGION END*/
}

