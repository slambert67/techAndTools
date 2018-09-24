package amrit

import org.hibernate.annotations.Type
import javax.persistence.*

/**
 * Student Level Validation Table
 */
@Entity
@Table(name = "STVLEVL")
class Level implements Serializable {

    @Id
    @Column(name = "STVLEVL_SURROGATE_ID")
    @SequenceGenerator(name = "STVLEVL_SEQ_GEN", allocationSize = 1, sequenceName = "STVLEVL_SURROGATE_ID_SEQUENCE")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "STVLEVL_SEQ_GEN")
    Long id

    /**
     * This field identifies the student level code referenced in the Catalog, Recruiting, Admissions, Gen Student, Registration, and Acad Hist Modules. Required value: 00 - Level Not Declared.
     */
    @Column(name = "STVLEVL_CODE", nullable = false, unique = true, length = 2)
    String code

    /**
     * This field specifies the student level (e.g. undergraduate, graduate, professional) associated with the student level code.
     */
    @Column(name = "STVLEVL_DESC", nullable = false, length = 30)
    String description

    /**
     * This field identifies the most recent date a record was created or updated.
     */
    @Column(name = "STVLEVL_ACTIVITY_DATE")
    @Temporal(TemporalType.TIMESTAMP)
    Date lastModified

    /**
     * This field is not currently in use.
     */
    @Type(type = "yes_no")
    @Column(name = "STVLEVL_ACAD_IND")
    Boolean acadInd

    /**
     * Continuing Education Indicator.
     */
    @Type(type = "yes_no")
    @Column(name = "STVLEVL_CEU_IND", nullable = false)
    Boolean ceuInd

    /**
     * System Required Indicator
     */
    @Type(type = "yes_no")
    @Column(name = "STVLEVL_SYSTEM_REQ_IND")
    Boolean systemReqInd

    /**
     * The Voice Response message number assigned to the recorded message that describes the student level.
     */
    @Column(name = "STVLEVL_VR_MSG_NO", precision = 6)
    Integer vrMsgNo

    /**
     * EDI Level Code
     */
    @Column(name = "STVLEVL_EDI_EQUIV", length = 2)
    String ediEquiv

    /**
     * Column for storing last modified by for STVLEVL
     */
    @Column(name = "STVLEVL_USER_ID", length = 30)
    String lastModifiedBy

    /**
     * Optimistic Lock Token for STVLEVL
     */
    @Version
    @Column(name = "STVLEVL_VERSION", nullable = false, precision = 19)
    Long version

    /**
     * Column for storing data origin for STVLEVL
     */
    @Column(name = "STVLEVL_DATA_ORIGIN", length = 30)
    String dataOrigin


     //Read Only fields that should be protected against update
    public static readonlyProperties = ['code']
    /**
     * Please put all the custom methods/code in this protected section to protect the code
     * from being overwritten on re-generation
     */
    /*PROTECTED REGION ID(level_custom_methods) ENABLED START*/

    /*PROTECTED REGION END*/
}

