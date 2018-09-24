package amrit


import javax.persistence.*

/**
 * Detail Charge/Payment Category Code Validation Table
 */

@Entity
@Table(name="TTVDCAT")
class DetailChargePaymentCategory implements Serializable {

    /**
     * Surrogate ID for TTVDCAT
     */
    @Id
    @Column(name="TTVDCAT_SURROGATE_ID")
    @SequenceGenerator(name = "TTVDCAT_SEQ_GEN", allocationSize = 1, sequenceName = "TTVDCAT_SURROGATE_ID_SEQUENCE")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "TTVDCAT_SEQ_GEN")
    Long id

    /**
     * This field identifies the detail charge/payment category code referenced by Student Bill Mod.  Reqd vals: APF - Admis Applicatn Chgs, FA - Fin Aid, FEE - Registr.  Fees, HOU - Housing, TUI - Registr.  Tuition, TRN - Transcript Fee.
     */
    @Column(name="TTVDCAT_CODE" )
    String code

    /**
     * This field specifies the free-format detail category associated with the detail category code.  Used to group charges/payments together for billing reporting purposes.
     */
    @Column(name="TTVDCAT_DESC" )
    String description

    /**
     * This field identifies the most recent date a record was created or updated.
     */
    @Column(name="TTVDCAT_ACTIVITY_DATE" )
    @Temporal(TemporalType.TIMESTAMP)
    Date lastModified

    /**
     * A "Y" indicates that the corresponding code is required by BANNER.  Removal may cause unpredictable results.
     */
    @Column(name="TTVDCAT_SYSREQ_IND" )
    String systemRequiredIndicator

    /**
     * Voice Response(VR) message number assigned to the recorded message that describes the category code.
     */
    @Column(name="TTVDCAT_VR_MSG_NO" )
    Long voiceResponseMsgNumber

    /**
     * Version column which is used as a optimistic lock token for TTVDCAT
     */
    @Version
    @Column(name="TTVDCAT_VERSION" )
    Long version

    /**
     * Last Modified By column for TTVDCAT
     */
    @Column(name="TTVDCAT_USER_ID", length=30)
    String lastModifiedBy

    /**
     * Data Origin column for TTVDCAT
     */
    @Column(name="TTVDCAT_DATA_ORIGIN" )
    String dataOrigin


    /**
     * Please put all the custom methods/code in this protected section to protect the code
     * from being overwritten on re-generation
     */
    /*PROTECTED REGION ID(detailchargepaymentcategory_custom_methods) ENABLED START*/

    /*PROTECTED REGION END*/
}

