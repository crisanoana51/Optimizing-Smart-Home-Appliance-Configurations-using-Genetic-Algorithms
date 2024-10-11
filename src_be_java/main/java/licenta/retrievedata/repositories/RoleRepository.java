package licenta.retrievedata.repositories;

import licenta.retrievedata.entitites.ERole;
import licenta.retrievedata.entitites.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}

