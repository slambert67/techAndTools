package amrit

import org.hibernate.annotations.Type
import javax.persistence.*

/**
 * Subject Validation Table
 */
@Entity
@Table(name = "STVSUBJ")
class Subject implements Serializable {

    /**
     * Surrogate ID for STVSUBJ
     */
    @Id
    @Column(name = "STVSUBJ_SURROGATE_ID")
    @SequenceGenerator(name = "STVSUBJ_SEQ_GEN", allocationSize = 1, sequenceName = "STVSUBJ_SURROGATE_ID_SEQUENCE")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "STVSUBJ_SEQ_GEN")
    Long id

    /**
     * This field identifies the subject code referenced in the Catalog, Registration and Acad.  Hist.  Modules.
     */
    @Column(name = "STVSUBJ_CODE", nullable = false, unique = true, length = 4)
    String code

    /**
     * This field specifies the subject associated with the subject code.
     */
    @Column(name = "STVSUBJ_DESC", length = 30)
    String description

    /**
     * This field identifies the most recent date a record was created or updated.
     */
    @Column(name = "STVSUBJ_ACTIVITY_DATE")
    @Temporal(TemporalType.TIMESTAMP)
    Date lastModified

    /**
     * The Voice Response message number assigned to the recorded message that describes the subject code.
     */
    @Column(name = "STVSUBJ_VR_MSG_NO", precision = 6)
    Integer vrMsgNo

    /**
     * Web registration indicator
     */
    @Type(type = "yes_no")
    @Column(name = "STVSUBJ_DISP_WEB_IND", nullable = false)
    Boolean dispWebInd

    /**
     * Column for storing last modified by for STVSUBJ
     */
    @Column(name = "STVSUBJ_USER_ID", length = 30)
    String lastModifiedBy

    /**
     * Optimistic Lock Token for STVSUBJ
     */
    @Version
    @Column(name = "STVSUBJ_VERSION", nullable = false, precision = 19)
    Long version

    /**
     * Column for storing data origin for STVSUBJ
     */
    @Column(name = "STVSUBJ_DATA_ORIGIN", length = 30)
    String dataOrigin


     /* Please put all the custom methods/code in this protected section to protect the code
     * from being overwritten on re-generation
     */
    /*PROTECTED REGION ID(subject_custom_methods) ENABLED START*/

    /*PROTECTED REGION END*/
}

