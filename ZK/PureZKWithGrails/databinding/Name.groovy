package databinding

import javax.persistence.*

@Entity
@Table(name = "NAMES")
class Name implements Serializable {

    @Id
    @Column(name = "SURROGATE_ID")
    @SequenceGenerator(name = "NAMES_SEQ_GEN", allocationSize = 1, sequenceName = "SORATMT_SURROGATE_ID_SEQUENCE")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "NAMES_SEQ_GEN")
    Long id

    @Column(name = "FIRST_NAME")
    String firstName

    @Column(name = "LAST_NAME")
    String lastName

    @Version
    @Column(name = "VERSION")
    Long version
}
