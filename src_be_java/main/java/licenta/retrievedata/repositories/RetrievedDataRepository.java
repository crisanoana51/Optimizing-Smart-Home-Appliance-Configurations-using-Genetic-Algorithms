package licenta.retrievedata.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import licenta.retrievedata.entitites.RetrievedData;
import org.springframework.stereotype.Repository;


@Repository
public interface RetrievedDataRepository extends JpaRepository<RetrievedData, Long> {
}
