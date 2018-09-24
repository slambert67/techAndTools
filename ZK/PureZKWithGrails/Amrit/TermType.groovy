package amrit

import org.hibernate.annotations.Type
import javax.persistence.*

/**
 * Term Type Validation Table.
 */
@Entity
@Table(name = "STVTRMT")
class TermType implements Serializable {

    /**
     * Surrogate ID for STVTRMT
     */
    @Id
    @Column(name = "STVTRMT_SURROGATE_ID")
    @SequenceGenerator(name = "STVTRMT_SEQ_GEN", allocationSize = 1, sequenceName = "STVTRMT_SURROGATE_ID_SEQUENCE")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "STVTRMT_SEQ_GEN")
    Long id

    /**
     * Type of term, eg.  2 - semester, 4 - quarter.
     */
    @Column(name = "STVTRMT_CODE", nullable = false, unique = true, length = 1)
    String code

    /**
     * Specifies the type of term associated with term type code.
     */
    @Column(name = "STVTRMT_DESC", nullable = false, length = 30)
    String description

    /**
     * Most recent date record was created or updated.
     */
    @Column(name = "STVTRMT_ACTIVITY_DATE")
    @Temporal(TemporalType.TIMESTAMP)
    Date lastModified

    /**
     * Column for storing last modified by for STVTRMT
     */
    @Column(name = "STVTRMT_USER_ID", length = 30)
    String lastModifiedBy

    /**
     * Optimistic Lock Token for STVTRMT
     */
    @Version
    @Column(name = "STVTRMT_VERSION", nullable = false, precision = 19)
    Long version

    /**
     * Column for storing data origin for STVTRMT
     */
    @Column(name = "STVTRMT_DATA_ORIGIN")
    String dataOrigin


    /**
     * Please put all the custom methods/code in this protected section to protect the code
     * from being overwritten on re-generation
     */
    /*PROTECTED REGION ID(termtype_custom_methods) ENABLED START*/

    /*PROTECTED REGION END*/
}

