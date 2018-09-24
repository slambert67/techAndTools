package amrit

import javax.persistence.Id
import javax.persistence.Column
import javax.persistence.SequenceGenerator
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Version
import javax.persistence.Temporal
import javax.persistence.TemporalType
import javax.persistence.Entity
import javax.persistence.Table
import javax.persistence.ManyToOne
import javax.persistence.JoinColumns
import javax.persistence.JoinColumn
import javax.persistence.NamedQueries
import javax.persistence.NamedQuery

@Entity
@Table(name = "SCRFEES")
@NamedQueries(value = [
@NamedQuery(name = "CourseFee.fetchBySubjectCourseNumberAndTermEffective",
query = """FROM  CourseFee a
		   WHERE a.courseCatalog.subject.code = :subjectCode
		   AND   a.courseCatalog.courseNumber = :courseNumber
		   AND   a.termEffective.code = :termCodeEffective
	       ORDER BY a.sequenceNumber """)])

/*
		   AND   a.detail.code is not null
	       AND   a.termEffective.code = (SELECT MAX(b.termEffective.code)
	                                     FROM   CourseFee b
	                                     WHERE  b.termEffective.code <= :termCodeEffective
	                                     AND    b.courseCatalog.subject.code = :subjectCode
	                                     AND    b.courseCatalog.courseNumber = :courseNumber)

 */
class CourseFee implements Serializable {

    /**
     * Surrogate ID for SCRFEES
     */
    @Id
    @Column(name = "SCRFEES_SURROGATE_ID")
    @SequenceGenerator(name = "SCRFEES_SEQ_GEN", allocationSize = 1, sequenceName = "SCRFEES_SURROGATE_ID_SEQUENCE")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SCRFEES_SEQ_GEN")
    Long id

    /**
     * Version column which is used as a optimistic lock token for SCRFEES
     */
    @Version
    @Column(name = "SCRFEES_VERSION", nullable = false, length = 19)
    Long version

    /**
     * This field specifies the most current date record was created or updated.
     */
    @Column(name = "SCRFEES_ACTIVITY_DATE")
    @Temporal(TemporalType.TIMESTAMP)
    Date lastModified

    /**
     * USER ID: ID of the user who created or last updated this record.
     */
    @Column(name = "SCRFEES_USER_ID")
    String lastModifiedBy

    /**
     * Data Origin column for SCRFEES
     */
    @Column(name = "SCRFEES_DATA_ORIGIN")
    String dataOrigin

    /**
     * Foreign Key : FK1_SCRFEES_INV_SCBCRKY_KEY
     */
    @ManyToOne
    @JoinColumns([
    @JoinColumn(name = "SCRFEES_SUBJ_CODE", referencedColumnName = "SCBCRKY_SUBJ_CODE"),
    @JoinColumn(name = "SCRFEES_CRSE_NUMB", referencedColumnName = "SCBCRKY_CRSE_NUMB")
    ])
    CourseCatalog courseCatalog

    /**
     * Foreign Key : FK1_SCRFEES_INV_STVTERM_CODE
     */
    @ManyToOne
    @JoinColumns([
    @JoinColumn(name = "SCRFEES_EFF_TERM", referencedColumnName = "STVTERM_CODE")
    ])
    Term termEffective

    /**
     * Foreign Key : FK1_SCRFEES_INV_TBBDETC_KEY
     */
    @ManyToOne
    @JoinColumns([
    @JoinColumn(name="SCRFEES_DETL_CODE", referencedColumnName="TBBDETC_DETAIL_CODE")
    ])
    StudentAccountsDetailChargePayment detail

    @Column(name = "SCRFEES_FEE_AMOUNT")
    BigDecimal feeAmount

    /**
     * Foreign Key : FK1_SCRFEES_INV_STVFTYP_CODE
     */
    @ManyToOne
    @JoinColumns([
    @JoinColumn(name = "SCRFEES_FTYP_CODE", referencedColumnName = "STVFTYP_CODE")
    ])
    FeeType feeType

    /**
     * Foreign Key : FK2_SCRFEES_INV_STVLEVL_CODE
     */
    @ManyToOne
    @JoinColumns([
    @JoinColumn(name = "SCRFEES_LEVL_CODE_STDN", referencedColumnName = "STVLEVL_CODE")
    ])
    Level levelStudent

    /**
     * SEQ NUMBER: Sequence number for making a unique index.
     */
    @Column(name = "SCRFEES_SEQ_NO")
    Long sequenceNumber


    public static List fetchBySubjectCourseNumberAndTermEffective(String subject,
                                                                  String courseNumber,
                                                                  String termEffective) {
        def courseFeeList = ""
        courseFeeList = CourseFee.withSession {
            session -> session.getNamedQuery('CourseFee.fetchBySubjectCourseNumberAndTermEffective')
                    .setString('subjectCode', subject)
                    .setString('courseNumber', courseNumber)
                    .setString('termCodeEffective', termEffective).list()
        }

    }
}
