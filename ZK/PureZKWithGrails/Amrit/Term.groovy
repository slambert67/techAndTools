package amrit

import org.hibernate.annotations.Type
import javax.persistence.*

/**
 * Term Code Validation Table
 */
@Entity
@Table(name = "STVTERM")

class Term implements Serializable {

    /**
     * Surrogate ID for STVTERM
     */
    @Id
    @Column(name = "STVTERM_SURROGATE_ID")
    @SequenceGenerator(name = "STVTERM_SEQ_GEN", allocationSize = 1, sequenceName = "STVTERM_SURROGATE_ID_SEQUENCE")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "STVTERM_SEQ_GEN")
    Long id

    /**
     * This field identifies the term code referenced in the Catalog, Recruiting, Admissions, Gen. Student, Registration, Student Billing and Acad. Hist. Modules. Reqd. value: 999999 - End of Time.
     */
    @Column(name = "STVTERM_CODE", nullable = false, unique = true, length = 6)
    String code

    /**
     * This field specifies the term associated with the term code. The term is identified by the academic year and term number and is formatted YYYYTT.
     */
    @Column(name = "STVTERM_DESC", nullable = false, length = 30)
    String description

    /**
     * This field identifies the term start date and is formatted DD-MON-YY.
     */
    @Column(name = "STVTERM_START_DATE", nullable = false)
    @Temporal(TemporalType.DATE)
    Date startDate

    /**
     * This field identifies the term end date and is fomatted DD-MON-YY.
     */
    @Column(name = "STVTERM_END_DATE", nullable = false)
    @Temporal(TemporalType.DATE)
    Date endDate

    /**
     * This field identifies the financial aid processing start and end years (e.g. The financial aid processing year 1988 - 1989 is formatted 8889.).
     */
    @Column(name = "STVTERM_FA_PROC_YR", length = 4)
    String financialAidProcessingYear

    /**
     * This field identifies the most recent date a record was created or updated.
     */
    @Column(name = "STVTERM_ACTIVITY_DATE")
    @Temporal(TemporalType.TIMESTAMP)
    Date lastModified

    /**
     * This field identifies the financial aid award term.
     */
    @Column(name = "STVTERM_FA_TERM", length = 1)
    String financialAidTerm

    /**
     * This field identifies the financial aid award beginning period.
     */
    @Column(name = "STVTERM_FA_PERIOD", precision = 2)
    Integer financialAidPeriod

    /**
     * This field identifies the financial aid award ending period.
     */
    @Column(name = "STVTERM_FA_END_PERIOD", precision = 2)
    Integer financialEndPeriod

    /**
     * Housing Start Date.
     */
    @Column(name = "STVTERM_HOUSING_START_DATE", nullable = false)
    @Temporal(TemporalType.DATE)
    Date housingStartDate

    /**
     * Housing End Date.
     */
    @Column(name = "STVTERM_HOUSING_END_DATE", nullable = false)
    @Temporal(TemporalType.DATE)
    Date housingEndDate

    /**
     * System Required Indicator
     */
    @Type(type = "yes_no")
    @Column(name = "STVTERM_SYSTEM_REQ_IND")
    Boolean systemReqInd

    /**
     * SUMMER INDICATOR: Indicates a summer term to financial aid.
     */
    @Type(type = "yes_no")
    @Column(name = "STVTERM_FA_SUMMER_IND")
    Boolean financeSummerIndicator

    /**
     * Column for storing last modified by for STVTERM
     */
    @Column(name = "STVTERM_USER_ID", length = 30)
    String lastModifiedBy

    /**
     * Optimistic Lock Token for STVTERM
     */
    @Version
    @Column(name = "STVTERM_VERSION", nullable = false, precision = 19)
    Long version

    /**
     * Column for storing data origin for STVTERM
     */
    @Column(name = "STVTERM_DATA_ORIGIN", length = 30)
    String dataOrigin

    /**
     * Foreign Key : FK1_STVTERM_INV_STVACYR_CODE
     */
    @ManyToOne
    @JoinColumns([
    @JoinColumn(name = "STVTERM_ACYR_CODE", referencedColumnName = "stvacyr_code")
    ])
    AcademicYear acyr_code

    /**
     * Foreign Key : FK1_STVTERM_INV_STVTRMT_CODE
     */
    @ManyToOne
    @JoinColumns([
    @JoinColumn(name = "STVTERM_TRMT_CODE", referencedColumnName = "STVTRMT_CODE")
    ])
    TermType trmt_code

    /**
     * Please put all the custom methods/code in this protected section to protect the code
     * from being overwritten on re-generation
     */
    /*PROTECTED REGION ID(term_custom_methods) ENABLED START*/


    /*PROTECTED REGION END*/
}

