package amrit


import javax.persistence.*

/**
 * Fee Type Validation Table
 */

@Entity
@Table(name = "STVFTYP")
class FeeType implements Serializable {

    /**
     * Surrogate ID for STVFTYP
     */
    @Id
    @Column(name = "STVFTYP_SURROGATE_ID")
    @SequenceGenerator(name = "STVFTYP_SEQ_GEN", allocationSize = 1, sequenceName = "STVFTYP_SURROGATE_ID_SEQUENCE")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "STVFTYP_SEQ_GEN")
    Long id

    /**
     * Fee Type Code
     */
    @Column(name = "STVFTYP_CODE", nullable = false, length = 4)
    String code

    /**
     * Description: Description of the Fee Type code
     */
    @Column(name = "STVFTYP_DESC", nullable = false, length = 30)
    String description

    /**
     * System Required Indicator: Indicates whether or not this record is required to exist on the database
     */
    @Column(name = "STVFTYP_SYS_REQ_IND", nullable = false, length = 1)
    String systemRequiredIndicator

    /**
     * Activity Date: Date this record entered or last updated
     */
    @Column(name = "STVFTYP_activity_date")
    @Temporal(TemporalType.TIMESTAMP)
    Date lastModified

    /**
     * User ID: The username of the person who entered or last updated this record
     */
    @Column(name = "STVFTYP_USER_ID", length = 30)
    String lastModifiedBy

    /**
     * Version column which is used as a optimistic lock token for STVFTYP
     */
    @Version
    @Column(name = "STVFTYP_VERSION", nullable = false, length = 19)
    Long version

    /**
     * Data Origin column for STVFTYP
     */
    @Column(name = "STVFTYP_DATA_ORIGIN", length = 30)
    String dataOrigin

/**
 * Please put all the custom methods/code in this protected section to protect the code
 * from being overwritten on re-generation
 */
    /*PROTECTED REGION ID(feetype_custom_methods) ENABLED START*/

    /*PROTECTED REGION END*/
}

