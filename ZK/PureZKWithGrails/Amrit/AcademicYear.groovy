package amrit

import org.hibernate.annotations.Type
import javax.persistence.*

/**
 * Academic Year Validation Table.
 */
@Entity
@Table(name = "STVACYR")
class AcademicYear implements Serializable {

    /**
     * Surrogate ID for STVACYR
     */
    @Id
    @Column(name = "STVACYR_SURROGATE_ID")
    @SequenceGenerator(name = "STVACYR_SEQ_GEN", allocationSize = 1, sequenceName = "STVACYR_SURROGATE_ID_SEQUENCE")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "STVACYR_SEQ_GEN")
    Long id

    /**
     * Identifies the abbreviation for the beginning/ ending periods for academic year referenced in the General Student, Academic History, Degree Audit Modules. Format CCYY (e.g. 1995-1996 coded 1996).
     */
    @Column(name = "STVACYR_CODE", nullable = false, unique = true, length = 4)
    String code

    /**
     * This field specifies the academic year associated with the academic year code.
     */
    @Column(name = "STVACYR_DESC", length = 30)
    String description

    /**
     * This field identifies the most current date a record was created or updated.
     */
    @Column(name = "STVACYR_ACTIVITY_DATE")
    @Temporal(TemporalType.TIMESTAMP)
    Date lastModified

    /**
     * The system required indicator
     */
    @Type(type = "yes_no")
    @Column(name = "STVACYR_SYSREQ_IND")
    Boolean sysreqInd

    /**
     * Column for storing last modified by for STVACYR
     */
    @Column(name = "STVACYR_USER_ID", nullable = false, length = 30)
    String lastModifiedBy

    /**
     * Optimistic Lock Token for STVACYR
     */
    @Version
    @Column(name = "STVACYR_VERSION", nullable = false, precision = 19)
    Long version

    /**
     * Column for storing data origin for STVACYR
     */
    @Column(name = "STVACYR_DATA_ORIGIN", length = 30)
    String dataOrigin

    /**
     * Please put all the custom methods/code in this protected section to protect the code
     * from being overwritten on re-generation
     */
    /*PROTECTED REGION ID(academicyear_custom_methods) ENABLED START*/

    /*PROTECTED REGION END*/
}

