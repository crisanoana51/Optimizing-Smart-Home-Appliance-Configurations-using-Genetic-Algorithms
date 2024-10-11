package licenta.retrievedata.repositories;

import licenta.retrievedata.entitites.PreferredDevice;
import licenta.retrievedata.entitites.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PreferredDeviceRepository extends JpaRepository<PreferredDevice, Long> {
    List<PreferredDevice> findByUser(User user);
}
