package amrit

import org.apache.commons.lang.StringUtils
import javax.persistence.*

/**
 * Course Catalog Base Table.
 */
@Entity
@Table(name = "SCBCRKY")

class CourseCatalog implements Serializable {

    /**
     * Surrogate ID for SCBCRKY
     */
    @Id
    @Column(name = "SCBCRKY_SURROGATE_ID")
    @SequenceGenerator(name = "SCBCRKY_SEQ_GEN", allocationSize = 1, sequenceName = "SCBCRKY_SURROGATE_ID_SEQUENCE")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SCBCRKY_SEQ_GEN")
    Long id

    /**
     * This field specifies the most current date record was created or updated.
     */
    @Column(name = "SCBCRKY_activity_date")
    @Temporal(TemporalType.TIMESTAMP)
    Date lastModified

    /**
     * Column for storing last modified by for SCRLEVL
     */
    @Column(name = "SCBCRKY_USER_ID")
    String lastModifiedBy

    /**
     * Optimistic Lock Token for SCRLEVL
     */
    @Version
    @Column(name = "SCBCRKY_VERSION", nullable = false, length = 19)
    Long version

    /**
     * This field defines the course number associated with the subject for the        course.
     */
    @Column(name = "SCBCRKY_CRSE_NUMB", nullable = false, length = 5)
    String courseNumber

    /**
     * Column for storing data origin for SCRLEVL
     */
    @Column(name = "SCBCRKY_DATA_ORIGIN")
    String dataOrigin

    /**
     * Column for storing data term start
     */
    @ManyToOne
    @JoinColumns([
    @JoinColumn(name = "SCBCRKY_TERM_CODE_START", referencedColumnName = "STVTERM_CODE")
    ])
    Term termStart

    /**
     * Column for storing data term end
     */
    @ManyToOne
    @JoinColumns([
    @JoinColumn(name = "SCBCRKY_TERM_CODE_END", referencedColumnName = "STVTERM_CODE")
    ])
    Term termEnd

    /**
     * Column for storing subject code
     */
    @ManyToOne
    @JoinColumns([
    @JoinColumn(name = "SCBCRKY_SUBJ_CODE", referencedColumnName = "STVSUBJ_CODE")
    ])
    Subject subject



}

